
## Problems running afl-fuzz

If afl-fuzz it complains about the size of the dictionary, check the file in ANSI not UTF-8
Check unix line endines not windows.

## Getting going with Windows WSL Ubuntu 18

```bash
sudo apt install make
sudo apt install gcc
apt upgrade gcc

wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo add-apt-repository universe
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install dotnet-sdk-2.2

bash setup.sh
```
