# Micorosft Azure 上に本構成をデプロイする

ここでは主に、Microsoft Azure 上で本サンプルコードを実行するための Azure リソースの作成について記載します。

また Azure Static Web app へのコードのデプロイは、GitHub Actions を用いて構成しています。

ここでは下記のツールを利用します。本リポジトリの [development container](../.devcontainer/) の環境にはインストール済みです。

- [Teraform](https://www.terraform.io/downloads.html)
- [Azure CLI](https://docs.microsoft.com/ja-jp/cli/azure/install-azure-cli)

## 事前準備

### GitHub リポジトリの準備

本リポジトリを適宜フォークし、GitHub Actions を実行できるようにご準備ください。

### LINE チャンネルの準備

LINE Developersコンソールで２つのチャンネル（ログイン、Messaging API）を作成する必要があります。下記を参考に作成してください。

- [LIFFアプリに利用するチャネルを作成する](../../docs/create-line-channels.md)

なお、作成したそれぞれのチャネルの下記の情報が必要になるので、控えておいてください。

| チャネル | 項目 | 説明 |
|----|----|----|
| LINEログイン | チャネルID | 「チャネル基本設定」タブ > 「基本設定」 > 「チャネルID」 |
| LINEログイン | LIFF ID | 「LIFF」タブ > 作成したLIFFアプリ > 「LIFF ID」 |
| LINEログイン | LIFF URL | 「LIFF」タブ > 作成したLIFFアプリ > 「LIFF URL」 |
| Messaging API | チャネルID | 「チャネル基本設定」タブ > 「基本設定」 > 「チャネルID」 |
| Messaging API | チャネルシークレット | 「チャネル基本設定」タブ > 「基本設定」 > 「チャネルシークレット」 |

## Terraform によるリソース配置

### 環境準備

この Terraform コードで Backend に Azure (Blob storage) を指定したい場合は、 `backend_override.tf.example` を参考に、`backend_override.tf` を配置すると、切替えが容易です。`*backend_override.tf` によるオーバーライドについては後述備考 [Terraform のオーバーライドの仕組み](#terraform-のオーバーライドの仕組み) をご参考ください。

- Terraform ステート管理用の [Azure storage account](https://docs.microsoft.com/ja-jp/azure/storage/common/storage-account-overview) を作成し、`tfstate` の名前で Blob コンテナを作成する
- `backend_override.tf.example` を `backend_override.tf` としてコピーし、 `resource_group_name` と `storage_account_name` の値を指定する

上記の準備ができたら、下記を実行して Terraform プロジェクトの初期化を行います。

```bash
# Azure のサブスクリプションにログインする
az login

# Terraform プロジェクトの初期化を行う
terraform init
```

### リソースをデプロイする

リソースをデプロイしたのち、Azure Static Web App の設定を行います。

```bash
terraform plan
terraform apply
```

### リソースの情報を控える

`terraform output` を利用して、各種設定値を控えておきます。

```bash
terraform output -json | jq "map_values(.value)"
```

下記のような JSON が表示されます。

```json
{
  "cosmosdb_connection_string": "<Cosmos DB's connection string>",
  "cosmosdb_container_name": "TaxiReserveCol",
  "cosmosdb_database_name": "TaxiReserveDb",
  "cosmosdb_endpoint": "https://<Cosmos DB's name>.documents.azure.com",
  "cosmosdb_key": "<Cosmos DB's primary key>",
  "resource_group_name": "<Resource group name>",
  "stapp_api_key_admin": "<Static Web app API key (admin)>",
  "stapp_api_key_client": "<Static Web app API key (client)>",
  "stapp_default_host_name_client": "<Static Web app default host name (client)",
  "stapp_id_admin": "<Static Web app resource ID (admin)>",
  "stapp_id_client": "<Static Web app resource ID (client)>",
}
```

※ [jq](https://stedolan.github.io/jq/) コマンドは適宜ご用意ください。

## LINEログインチャネルの LIFF のエンドポイントを更新する

上記で表示したリソースの情報のうち、 `stapp_default_host_name_client` の値がクライアントの Static Web app のホスト名（例: `
<allocated identifier>.1.azurestaticapps.net` ）です。

これを LIFF のエンドポイントとして設定します。LINE Developersコンソールから、LINEログインチャネルの LIFF の「Endpoint URL」に `
https://<allocated identifier>.1.azurestaticapps.net` の形式で指定します。

## Azure CLI によるアプリケーション設定の更新

Azure Static Web App の app settings を反映します。

それぞれ、下記の形式で JSON ファイルを作成し、下段のコマンドで反映します。コマンドでは、`--uri` オプションの値を適宜置き換えてください。

`client/api/local.settings.properties.json`
```json
{
  "properties": {
    "LINE_LOGIN_CHANNEL_ID": "<LINE ログイン チャネルの ID>",
    "LINE_MESSAGING_API_CHANNEL_ID": "<LINE Message API チャネルの ID>",
    "LINE_MESSAGING_API_CHANNEL_SECRET": "<LINE Message API チャネルのシークレット>",
    "COSMOS_CONNECTION": "<Cosmos DB's connection string>"
  }
}
```

```bash
az rest --method put --headers "Content-Type=application/json" --uri "<Static Web app resource ID (client)>/config/functionappsettings?api-version=2021-02-01" --body @client/api/local.settings.properties.json
```

`admin/api/local.settings.properties.json`
```json
{
  "Properties": {
    "LINE_MESSAGING_API_CHANNEL_ID": "<LINE Message API チャネルの ID>",
    "LINE_MESSAGING_API_CHANNEL_SECRET": "<LINE Message API チャネルのシークレット>",
    "COSMOSDB_ENDPOINT": "https://<Cosmos DB's name>.documents.azure.com",
    "COSMOSDB_KEY": "<Cosmos DB's primary key>",
    "COSMOSDB_DATABASE": "TaxiReserveDb",
    "COSMOSDB_CONTAINER": "TaxiReserveCol"
  }
}
```

```bash
az rest --method put --headers "Content-Type=application/json" --uri "<Static Web app resource ID (admin)>/config/functionappsettings?api-version=2021-02-01" --body @admin/api/local.settings.properties.json
```

## GitHub Actions のワークフローの整備

ワークフローファイルは既にリポジトリに格納しているので、下記のシークレットを環境に合わせて設定しておきます。

| シークレット名 | 値（説明） |
|----|----|
| `AZURE_STATIC_WEB_APPS_API_TOKEN_CLIENT` | デプロイ先の Static Web App の Deployment token を指定する（前述の Terraform のアウトプットの `stapp_api_key_client` で取得可能） |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN` | デプロイ先の Static Web App の Deployment token を指定する（前述の Terraform のアウトプットの `stapp_api_key_admin` で取得可能） |
| `LINE_LIFFID` | LINEログインチャネルの LIFF ID を指定する |

## GitHub Actions のワークフローを実行

ユーザークライアントおよび管理システムの GitHub Actions ワークフローは、`workflow_dispatch` による実行も可能です。初回のコードのデプロイなど、必要に応じて実行してください。

#### 補足

- [API による Azure Static Web app のアプリケーション設定について](#api-による-azure-static-web-app-のアプリケーション設定について)

## 備考

### Terraform のオーバーライドの仕組み

Terraform では、`override.tf` または `_override.tf` ファイルを配置すると設定をオーバーライドできます。詳しくはこちら [Override Files - Configuration Language - Terraform by HashiCorp](https://www.terraform.io/docs/language/files/override.html) をご参考ください。

### API による Azure Static Web app のアプリケーション設定について

上記のコマンドで実行しているAPI は、Environment が Production のアプリケーション設定を変更します。

- [Static Sites - Create Or Update Static Site Function App Settings](https://docs.microsoft.com/en-us/rest/api/appservice/static-sites/create-or-update-static-site-function-app-settings)

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/staticSites/{name}/config/functionappsettings?api-version=2021-02-01
```

もし、別の Environment のアプリケーション設定を更新したい場合は、下記を参考に API を差し替えて利用してください。

- [Static Sites - Create Or Update Static Site Build Function App Settings](https://docs.microsoft.com/en-us/rest/api/appservice/static-sites/create-or-update-static-site-build-function-app-settings)

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/staticSites/{name}/builds/{environmentName}/config/functionappsettings?api-version=2021-02-01
```
