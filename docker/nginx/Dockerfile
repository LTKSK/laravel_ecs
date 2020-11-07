FROM nginx:1.18-alpine

RUN apk update && \
  apk add --update --no-cache --virtual=.build-dependencies g++

# ecsで動かす時のhost。開発時はcomposeでappという値で置き換える
ENV PHP_HOST=127.0.0.1

COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf.template

EXPOSE 80
# 中身を置き換え
CMD /bin/sh -c 'sed "s/\${PHP_HOST}/${PHP_HOST}/" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"'

