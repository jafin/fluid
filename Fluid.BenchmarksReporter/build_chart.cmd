@ECHO The Benchmarks app must of already been run once for this to work

SET Benchmark_DataDir="..\Fluid.Benchmarks\BenchmarkDotNet.Artifacts\results\*.json"

@if not exist %Benchmark_DataDir% (
  @ECHO.
  @ECHO Benchmarks not found in %Benchmark_DataDir%, 
  @ECHO Have you run the benchmark tests?
  @ECHO.
  @GOTO :END
)

copy %Benchmark_DataDir% .\data\ /y
call npm i
call npm run run

:END
