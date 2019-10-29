FROM oryd/hydra:v1.0.8-alpine

ENV SUPPORTING_FILES /app

ARG HOST_NAME

USER root

RUN apk update && apk add --update alpine-sdk bash nano

RUN mkdir -p $SUPPORTING_FILES

WORKDIR $SUPPORTING_FILES

COPY . $SUPPORTING_FILES
