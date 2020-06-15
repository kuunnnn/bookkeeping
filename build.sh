#!/usr/bin/env bash


if [ ! -d "./html" ]; then
  mkdir ./html
fi

if [ ! -d "./logs" ]; then
  mkdir -p ./logs/mysql
  mkdir ./logs/nginx
  mkdir ./logs/redis
  mkdir ./logs/server
  # 需要手动创建 redis.log 不然 docker 会创建出一个 redis.log 目录
  touch ./logs/redis/redis.log
fi


cd ./frontend
if [ $1 == "full" ] ; then
  echo "删除 node_modules 重新安装"
  rm -rf ./node_modules
  echo "开始安装依赖"
  yarn install 
  # yarn install --production
  rm -rf ./dist
  echo "开始打包"
  yarn build
else
  rm -rf ./dist
  echo "开始打包"
  yarn build
fi
echo "删除 html 目录"
rm -rf ../html/web
echo "移动到 html 目录"
mv ./dist/ ../html/web
cd ../



