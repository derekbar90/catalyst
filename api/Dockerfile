FROM node:12-alpine

ENV SUPPORTING_FILES /app
ARG DEV

# install bash for wait-for-it script
RUN apk update && apk add --update alpine-sdk build-base bash python nano

RUN npm i -g pnpm

RUN mkdir -p $SUPPORTING_FILES
RUN mkdir -p /node_modules

WORKDIR $SUPPORTING_FILES

ADD package.json .

RUN pnpm install

RUN cp -a ./node_modules /node_modules

COPY . $SUPPORTING_FILES