# Develop in a development container or Codespaces

## How to use

Visual Studio Code の [development container](https://code.visualstudio.com/docs/remote/containers) や GitHub Codespaces で本環境を起動することができます。

### 設定ファイルの生成

環境変数 `ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON` で下記の JSON の形式の設定値を渡すと、コンテナ起動時に実行される `postStartCommand` にて必要なファイルを生成させることができます。

```json
{
  "LINE_LOGIN_CHANNEL_ID": "{LINE Login Channel ID}",
  "LIFFID": "{LINE LIFF ID (inside Login Channel)}",
  "LINE_MESSAGING_API_CHANNEL_ID": "{LINE Messaging API Channel ID}",
  "LINE_MESSAGING_API_CHANNEL_SECRET": "{LINE Messaging API Channel Secret}",
  "COSMOSDB_ENDPOINT": "{Azure Cosmos DB's endpoint}",
  "COSMOSDB_KEY": "{Azure Cosmos DB's key}",
  "COSMOS_CONNECTION": "{Azure Cosmos DB's connection string}"
}
```

Visual Studio Code の dev container を利用する場合は、こちらをご参考ください。

- [Container environment variables](https://code.visualstudio.com/remote/advancedcontainers/environment-variables)

GitHub Codespaces を利用する場合は、Codespaces secrets (personal, repository, organization) で設定可能です。くわしくは、こちらをご参考ください。

- [Codespaces の暗号化されたシークレットを管理する - GitHub Docs](https://docs.github.com/ja/codespaces/managing-your-codespaces/managing-encrypted-secrets-for-your-codespaces)

生成されるファイルは下記のとおりです。

| 生成されるファイル | 説明 |
|----|----|
| `client/.env.local` | ユーザークライアントの Vite で読み込む環境変数を記載した .env ファイル。`client/.env` をもとに生成する。 |
| `client/api/local.settings.json` | ユーザークライアントの API (Azure Functions) で読み込む設定ファイル。`client/api/local.settings.example.json` をもとに生成する。 |
| `admin/api/local.settings.json` | 管理システムの API (Azure Functions) で読み込む設定 `admin/api/local.settings.example.json` をもとに生成する。 |

処理の詳細については、[./scripts/postStartCommand.sh] をご参照ください。
