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
swa start --api-location api
```
