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

Backend API に引き渡す環境変数を設定します。`api/local.settings.example.json` をもとに `api/local.settings.json` を作成し、JSON のそれぞれの値を設定してください。

- `LINE_LOGIN_CHANNEL_ID`
- `LINE_MESSAGING_API_CHANNEL_ID`
- `LINE_MESSAGING_API_CHANNEL_SECRET`
- `COSMOS_CONNECTION`

各値の詳細は [/iac/terraform/README.md](../iac/terraform/README.md) をご参考ください。

### プロジェクトのセットアップ

初回は、下記を参考に、このディレクトリと `api` ディレクトリでパッケージのインストールを行ってください。

```
npm install
pushd api
npm install
npm run build
popd
```

### Vite のみを実行する

Vite のみを実行する場合は、下記コマンドを実行します。なお、Backend API は動作しません。API を動作させたい場合は下記を参考ください。

```
npm run dev
```

### Backend API を含めた Static Web app に基づく開発環境を実行する

ローカル環境にて Backend API を含めた Static Web app に基づく開発環境を実行するには、下記コマンドを実行します。

```
npm run start
```

`http://127.0.0.1:4280` で立ち上がります。

### LINE ログインチャネルの LIFF のエンドポイントを更新する

ユーザークライアントは、LIFF で動作するため、初回に LINE ログインを求めるように構成されています。ログイン後にコールバックを受けてクライアントに遷移できるよう、LINE ログインチャネルの LIFF のエンドポイントを、`http://127.0.0.1:4280` に向ける必要があります。

LINE Developers コンソールから、LINE ログインチャネルの LIFF の「Endpoint URL」に指定してください。

なお、_https_ で指定する必要があるので、下記を参考に適宜ご対応ください。

- GitHub Codespaces を利用している場合は、ポート 4280 の Port visibility を Public に変更し、その URL を利用する
- [ngrok](https://ngrok.com/) などのツールを用いて、 _https_ の形式でトンネルを設けてその URL を利用する

### ビルド

本番用のビルドは、下記コマンドを実行します。

```
npm run build
```

詳細は [vue-loader](http://vuejs.github.io/vue-loader) のドキュメントを参照ください。
