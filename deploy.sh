#!/bin/bash

## 需要部署的机子上已经有nodejs yarn golang等

## 确保在用户目录下有这么几个文件夹
ssh ubuntu@119.29.5.95 "cd ~ ; mkdir -p ~/syncPlayer/"

### 复制内容
scp -rf ./** ubuntu@119.29.5.95:~/syncPlayer/

### 登陆后执行  eeof 可以自定义, 下面指令遇到eeof即停
###
ssh ubuntu@119.29.5.95 << eeof
cd syncPlayer && pwd
echo -e "\033[34m 如果有，则关闭之前运行的程序 \033[0m"
bash stop.sh
echo -e "\033[34m 编译程序 \033[0m"
bash build.sh
echo -e "\033[34m 开启程序 \033[0m"
bash start.sh
exit
eeof
echo "done!"

exit 0
