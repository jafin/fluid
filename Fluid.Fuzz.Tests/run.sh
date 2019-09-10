dotnet build
sharpfuzz bin/debug/netcoreapp2.2/fluid.dll
afl-fuzz -x dictionaries/liquid.dict -i TestCases -o Findings  \dotnet bin/debug/netcoreapp2.2/fluid.fuzz.tests.dll