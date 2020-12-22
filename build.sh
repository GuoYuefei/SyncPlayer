#!/bin/bash

mkdir -p ./build

cd front
yarn
yarn build
cp -rf dist ../build/
cd ..

cd syncplayer
go build server.go
cp -f server ../build/
cd ..
