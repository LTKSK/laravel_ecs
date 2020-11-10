# これは何？

laravel環境をecsで動かすための学習用のプロジェクトです  
AWS上の環境はcdkで構築するようにしています

# やりたかった事リスト

- laravelの開発環境の構築記事はたくさん引っかかるが、いざ本番で動かす時にはどうなるのか? を知りたかった
  - laravelのbuildやlog周りの設定についても覚えたかった
- ecs+fargateを使ってみたかった
- cdkを学習したかった
- docker/docker-composeをもっと触っておきたかった

# TODO
- [x] laravelの開発環境をdockerで作成する
- [x] laravelのlogをjson形式にして標準出力に流せるようにする
- [x] test用のendpoint作成
- [x] cdkでECRリポジトリを作成する
- [x] cdkでECS+Fargateの環境を構築する（まだDB無いからwelcomeが見えるだけだけど）
- [ ] cdkでrdsを作成する
- [ ] cdkでrdsのhost情報をparameterStoreに挿して、ecsで参照するようにする
- [ ] cdkでlaravelのmigrate用のecsのtaskを作成する
- [ ] cdkでcloudwatch Logsのmetrixとalert設定を構築する
- [ ] frontが存在しないのでnodeコンテナ追加してReactをbuildできるようにする

# 開発環境の動かし方

- プロジェクトのrootに移動
- `docker-compose up -d --build`
- `docker-compose exec app php artisan migrate`

# cdk環境の動かし方

(~/.awsをマウントしてcredを取得するようにしているので、嫌な場合はよしなに変えてください)

- infrastructureディレクトリにcd
- `docker-compose run cdk /bin/bash`
- `cd app`
- `npm run build`
- `cdk deploy` とかとか
