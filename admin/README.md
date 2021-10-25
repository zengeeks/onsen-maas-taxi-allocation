## タクシー配車予約機能

## 全体シーケンス

![全体シーケンス](../docs/self-paced-handson/images/admin/sequences.png)

## サンプルコード

### ディレクトリ構成

以下のような構成で、サンプルコードを格納しています。

```bash
├── .vscode             ... Visual Studio Code 用プロジェクト設定
├── api                 ... Backend API (Azure Functions 対応) 
├── README.md           ... このファイル
└── ...                 ... 静的サイトのファイル一式
```
### 開発

下記コマンドで、ローカル環境にて Backend API を含めた開発環境を実行できます。

```bash
swa start --api-location api --port 4281
```

タクシー予約一覧は `http://127.0.0.1:4281/taxireservationlist.html` からアクセスします。

### Vite's README

#### Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

##### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

##### Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
