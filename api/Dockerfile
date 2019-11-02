FROM node:12-alpine

ENV SUPPORTING_FILES /app
ARG DEV

RUN npm i -g pnpm

# install bash for wait-for-it script
RUN apk update && apk add --update alpine-sdk build-base bash python nano

ADD package.json /tmp/package.json
ADD pnpm-lock.yaml /tmp/pnpm-lock.yaml
RUN cd /tmp && pnpm install
RUN mkdir -p $SUPPORTING_FILES && cp -a /tmp/node_modules $SUPPORTING_FILES/

WORKDIR $SUPPORTING_FILES

COPY . $SUPPORTING_FILES