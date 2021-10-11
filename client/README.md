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

### Vue.js プロジェクト

Vue.js プロジェクトに関する補足は下記をご参考ください。

#### Project setup

```
npm install
pushd api
npm install
popd
```

#### Compiles and hot-reloads for Vite development

```
npm run dev
```

#### Start running Static Web App locally with vite environment

```
npm run start
```

#### Compiles and minifies for production

```
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
