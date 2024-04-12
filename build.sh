#!/bin/bash

# 仅编译web版本

##Enable legacy OpenSSL provider. NODE_OPTIONS为了应对node高版本改变了加密算法；如果是windows的powershell环境请注释linux代码打开windows代码；windows的git bash环境请忽略
# for linux
export NODE_OPTIONS=--openssl-legacy-provider         # for linux

# for windows powershell
# $env:NODE_OPTIONS = "--openssl-legacy-provider"

mkdir -p ./build

cd front
yarn
yarn build-web
cp -rf app/dist/renderer ../build
mv ../build/renderer ../build/dist
cd ..

cd syncplayer
go build server.go
cp -f server ../build/
cd ..
