FROM node:12-alpine

ENV SUPPORTING_FILES /app

# install bash for wait-for-it script
RUN apk update && apk add --update alpine-sdk build-base bash python nano

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $SUPPORTING_FILES && cp -a /tmp/node_modules $SUPPORTING_FILES/

WORKDIR $SUPPORTING_FILES

COPY . $SUPPORTING_FILES

RUN npm run setup
