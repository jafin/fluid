@ECHO Running benchmarks
dotnet run --filter * --configuration release --runtimes netcoreapp2.2 --exporters json
