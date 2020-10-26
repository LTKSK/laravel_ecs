# cdk環境を構築する用のdockerfile
FROM node:14.14.0

# awscli用にpythonをinstall
RUN apt-get update \ 
  && apt-get install -y python3 python3-pip
RUN pip3 install awscli

# rootで作るとcdkで作ったファイルにホストから触れなくなるのでその対応
WORKDIR /home/node
RUN chown -R node:node /home/node

# typescriptとaws-cdkをinstallしたコンテナを作る
RUN npm i -g typescript aws-cdk

# 先にglobal installをやるとpermissionで怒られる
# global installはrootでも問題ないのでその後にUSERを設定
USER node 

