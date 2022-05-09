# ユーザークライアント プロジェクト

このディレクトリ配下では、ユーザークライアントとして、[LIFF](https://developers.line.biz/ja/docs/liff/) を用いて、LINE アプリ内で LINE アカウントと連動させ配車を行うクライアントを実装しています。

## サンプルコード

### ディレクトリ構成

以下のような構成で、Vue.js によるサンプルコードを格納しています。

```bash
├── .vscode             ... Visual Studio Code 用プロジェクト設定
├── api                 ... Backend API (Azure Functions 対応)
├── public              ... Vue.js プロジェクトの public ディレクトリ
├── src                 ... Vue.js プロジェクトの src ディレクトリ
├── README.md           ... このファイル
└── ...                 ... Vue.js プロジェクトのファイル一式
```

## サンプルコードをローカル環境で実行する

### Backend API (Azure Functions 対応) のセットアップ

`api/local.settings.example.json` をもとに `api/local.settings.json` を作成し、JSON のそれぞれの値を設定してください。

- `LINE_LOGIN_CHANNEL_ID`
- `LINE_MESSAGING_API_CHANNEL_ID`
- `LINE_MESSAGING_API_CHANNEL_SECRET`
- `COSMOS_CONNECTION`

各値の詳細は [/iac/terraform/README.md](../iac/terraform/README.md) をご参考ください。

### Vue.js プロジェクト

Vue.js プロジェクトに関する補足は下記をご参考ください。

#### Project setup

```
npm install
pushd api
npm install
npm run build
popd
```

#### Compiles and hot-reloads for Vite development

```
npm run dev
```

#### Start running Static Web App locally with vite environment

下記コマンドで、ローカル環境にて Backend API を含めた開発環境を実行できます。

```
npm run start
```

`http://127.0.0.1:4280` で立ち上がります。

### LINE ログインチャネルの LIFF のエンドポイントを更新する

LINE ログインチャネルの LIFF のエンドポイントを、`http://127.0.0.1:4280` に向ける必要があります。

LINE Developers コンソールから、LINE ログインチャネルの LIFF の「Endpoint URL」に指定します。

_https_ で指定する必要があるので、下記を参考に適宜ご対応ください。

- GitHub Codespaces を利用している場合は、ポート 4280 の Port visibility を Public に変更し、その URL を利用する
- [ngrok](https://ngrok.com/) などのツールを用いて、 _https_ の形式でトンネルを設けてその URL を利用する

#### Compiles and minifies for production

```
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
