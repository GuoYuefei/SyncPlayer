#!/bin/bash

cd build

nohup ./server > server.out 2>&1 & echo $! > ../run.pid

ps -aux | grep server
cd ..