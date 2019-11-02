FROM node:12-alpine

ENV SUPPORTING_FILES /app
ARG DEV

# install bash for wait-for-it script
RUN apk update && apk add --update alpine-sdk build-base bash python nano postgresql-client

RUN npm i -g pnpm

ADD package.json .
ADD pnpm-lock.yaml .
RUN pnpm install
RUN mkdir -p $SUPPORTING_FILES && cp -a ./node_modules $SUPPORTING_FILES/

WORKDIR $SUPPORTING_FILES

COPY . $SUPPORTING_FILES