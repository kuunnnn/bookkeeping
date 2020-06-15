#!/usr/bin/env bash
mkdir -p logs/redis
touch logs/server/ormlogs.log

cd server

rm -rf ./node_modules
yarn install
yarn  global add pm2
yarn build
cd ../
