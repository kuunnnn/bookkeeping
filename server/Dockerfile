#FROM node:14.4.0-alpine
FROM node
RUN mkdir -p /root/app && npm install pm2 -g

WORKDIR /root/app


#COPY ./package*.json .
#
#RUN yarn install

#COPY . .

EXPOSE 8990

#CMD ["yarn","dev"]
#CMD ["node","dist/setup.js"]
# CMD ["pm2-runtime","./processes.json"]

