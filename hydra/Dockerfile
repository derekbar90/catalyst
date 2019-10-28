FROM node:10-alpine

ENV SUPPORTING_FILES /app
ARG DEV

# install bash for wait-for-it script
RUN apk update && apk add --update alpine-sdk build-base bash python nano

RUN mkdir -p $SUPPORTING_FILES

COPY . $SUPPORTING_FILES
