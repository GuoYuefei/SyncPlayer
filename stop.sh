#!/bin/bash

echo 'before stop: '
ps -aux | grep server

kill `cat ./run.pid`
echo 'after stop: '
ps -aux | grep server