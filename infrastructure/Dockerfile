# cdk環境を構築する用のdockerfile
FROM node:14.14.0

RUN apt update

# typescriptとaws-cdkをinstallしたコンテナを作る
RUN npm i -g typescript aws-cdk
WORKDIR /home/work

