import { CanvasRenderService } from 'chartjs-node-canvas';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import * as fs from 'fs';
import * as glob from 'glob';
import { BenchmarkResult } from './benchmarkResults';
import * as _ from 'lodash';
import { ChartPluginsOptions, ChartDataSets } from 'chart.js';

// read source data.
var jsonSourceFiles = glob.sync("Fluid*.json");

function GetChartData() {
  var testData = new Array<BenchmarkResult>();
  for (let file of jsonSourceFiles) {
    console.log('file' + file);
    var fileContents = fs.readFileSync(file, 'utf8');

    let fixedContents = fileContents.replace(/NaN/g, '0');
    //fix issue with benchmark.net writing NaN props -- https://github.com/dotnet/BenchmarkDotNet/issues/1242
    let results = JSON.parse(fixedContents);

    for (let benchmark of results.Benchmarks) {
      testData.push(new BenchmarkResult(benchmark.Type.replace(/Benchmarks/, ''), benchmark.MethodTitle, Math.round(benchmark.Statistics.Mean)));
    }
  }
  return testData;
}

let testData = GetChartData();

//oh noes, if we have more than 5 we're doomed
var chartBarColours = ["pink", "Lightblue", "lightgreen", "yellow", "purple"];

let testNames = _.flatMap(testData, (obj: BenchmarkResult) => {
  return obj.test;
});
let labels = _.uniq(testNames);

let groupNames = _.flatMap(testData, (obj: BenchmarkResult) => {
  return obj.group;
});
let groups = _.uniq(groupNames);

let datasets: ChartDataSets[] = new Array<ChartDataSets>();

//create datasets.
let currentIndex = 0;
for (let group of groups) {

  var filteredGroups = _.filter(testData, (obj: BenchmarkResult) => {
    return obj.group == group;
  });

  var filteredData = _.flatMap(filteredGroups, (obj: BenchmarkResult) => {
    return obj.result;
  });

  var dataSet: ChartDataSets = {
    label: group,
    backgroundColor: chartBarColours[currentIndex],
    data: filteredData
  };

  datasets.push(dataSet);
  currentIndex++;
}

const barChartData = {
  labels: labels,
  datasets: datasets
}

let chartPluginsOptions: ChartPluginsOptions = {};
chartPluginsOptions.datalabels = {
  align: "start",
  offset: -20,
  color: "black"
};

let chartProps = {
  exportFileName: 'benchmarks.png',
  width: 1024,
  height: 768,
  configuration: {
    type: 'bar',
    legend: {
      position: "top"
    },
    plugins: [ChartDataLabels],
    data: barChartData,
    options: {
      plugins: chartPluginsOptions,
      title: {
        display: true,
        text: "Benchmark comparison of .NET liquid template engines. (Mean, lower is better)"
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  }
}

const chartCallback = (ChartJS) => {

  // Global config example: https://www.chartjs.org/docs/latest/configuration/
  ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
  // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
  ChartJS.plugins.register({
    // plugin implementation
  });
  // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
  ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
    // chart implementation
  });
};

(async () => {
  const canvasRenderService = new CanvasRenderService(chartProps.width, chartProps.height, chartCallback);
  const image = await canvasRenderService.renderToBuffer(chartProps.configuration);

  fs.writeFile(chartProps.exportFileName, image, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log(chartProps.exportFileName + ' file created!');
  });
})();