# Build Chart App

## Overview

This app takes the output from The Benchmark.net test run and produces a summary chart using the mean value from each test.  
This should make it easier to update the benchmarks in the repo, or possibly forming part of a CI process.

## Operation

### Prerequisits

* Node 10
* Script expects the benchmarks to of already been run , and the output in json format exists in the configured folder.

Run:

```batch
build_chart.cmd
```

If successful, the chart will appear in the out folder
