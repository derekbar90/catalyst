FROM node:10-alpine

ENV SUPPORTING_FILES /app
ARG DEV

# install bash for wait-for-it script
RUN apk update && apk add --update alpine-sdk build-base bash python nano

ARG DB_NAME

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $SUPPORTING_FILES && cp -a /tmp/node_modules $SUPPORTING_FILES/

WORKDIR $SUPPORTING_FILES

COPY . $SUPPORTING_FILES

RUN if [ "x$DB_NAME" = "x" ] ; then echo Skipping postgresql client install ; else apk add postgresql-client ; fi

RUN if [ "$DEV" = "true" ]; then npm prune --production ; fi

#CMD ["npm", "start"]
