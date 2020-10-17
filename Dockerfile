FROM php:7.4-fpm-buster

ENV WORKDIR=/var/www/html
WORKDIR $WORKDIR

COPY --from=composer:1.10 /usr/bin/composer /usr/bin/composer

RUN apt-get update && \
  apt-get -y install git libicu-dev libonig-dev libzip-dev unzip locales && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  mkdir /var/run/php-fpm && \
  mkdir -p /tmp/cache/views && \
  chmod 777 -R /tmp/cache && \
  docker-php-ext-install intl pdo_mysql zip bcmath && \
  composer config -g process-timeout 3600 && \
  composer config -g repos.packagist composer https://packagist.org && \
  composer global require hirak/prestissimo

COPY ./laravel/composer.json ${WORKDIR}/
COPY ./laravel/composer.lock ${WORKDIR}/

COPY ./docker/php/php.ini /usr/local/etc/php/
COPY ./laravel ${WORKDIR}/
# php-fpmのuserが書き込むディレクトリに権限つけておく
RUN chmod -R a+w storage/ bootstrap/cache

