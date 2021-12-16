#!/bin/bash

mkdir -p ./build

cd front
yarn install-build-win
mv dist build
cp -rf build/ ../build/
cd ..