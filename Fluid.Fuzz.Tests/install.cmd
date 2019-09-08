dotnet tool install --global SharpFuzz.Commandline
REM https://github.com/Metalnem/sharpfuzz#installation

REM Buildthe app

sharpfuzz bin\debug\netcoreapp2.2\fluid.dll
