FROM nginx:1.18-alpine
ENV TZ=UTC

RUN apk update && \
  apk add --update --no-cache --virtual=.build-dependencies g++

COPY ./default.conf /etc/nginx/conf.d/default.conf

WORKDIR /work/backend

