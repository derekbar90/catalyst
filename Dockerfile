FROM node:10-alpine

ENV SUPPORTING_FILES /app
RUN mkdir $SUPPORTING_FILES
WORKDIR $SUPPORTING_FILES

# install bash for wait-for-it script
RUN apk update && apk add --update alpine-sdk bash

COPY . $SUPPORTING_FILES

RUN npm ci

RUN npm run build && npm prune --production

ENV NODE_ENV=production
#CMD ["npm", "start"]
