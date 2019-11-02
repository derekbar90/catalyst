FROM node:12-alpine

ENV NODE_MODULES /
ENV SUPPORTING_FILES /app

# install bash for wait-for-it script
RUN apk update && apk add --update alpine-sdk build-base bash python nano

RUN npm i -g yarn

WORKDIR $NODE_MODULES

ADD package.json package-lock.json* ./
RUN yarn install
ENV PATH /node_modules/.bin:$PATH

RUN mkdir -p $SUPPORTING_FILES

WORKDIR $SUPPORTING_FILES

COPY . $SUPPORTING_FILES

RUN yarn setup