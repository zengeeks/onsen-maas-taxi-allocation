# 【地方活性化！】MaaS Hands-On with Microsoft Azure【ミニアプリ】

このリポジトリは、[【地方活性化！】MaaS Hands-On with Microsoft Azure【ミニアプリ】](https://linedevelopercommunity.connpass.com/event/220376/) で行うハンズオンのサンプルコードとセルフペースドハンズオンの資料を含んでいます。

## セルフペースドハンズオン

セルフペースドハンズオンを実施される方は、 [docs/self-paced-handson](./docs/self-paced-handson) へお進みください。

### ご質問、トラブルシューティングの受付

ご質問やトラブルシューティングは、このリポジトリの [GitHub Discussions](https://github.com/dzeyelid/onsen-maas-vueapp/discussions) にて受け付けます。

## サンプルコード

### ディレクトリ構成

以下のような構成で、Vue.js によるサンプルコードや、ドキュメントを格納しています。

```bash
├── .devcontainer       ... Dev container 構成
├── .vscode             ... Visual Studio Code 用プロジェクト設定
├── api                 ... Backend API (Azure Functions 対応) 
├── docs                ... 資料などドキュメンテーション
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
```

#### Compiles and hot-reloads for development

```
npm run serve
```

#### Compiles and minifies for production

```
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
