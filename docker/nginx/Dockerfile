FROM nginx:1.18-alpine

RUN apk update && \
  apk add --update --no-cache --virtual=.build-dependencies g++

COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

