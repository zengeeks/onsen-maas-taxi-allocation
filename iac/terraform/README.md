# Micorosft Azure 上に本構成をデプロイする

Terraform を用いて、Microsoft Azure 上に本構成をデプロイします。

ここでは下記のツールを利用します。

- [Teraform](https://www.terraform.io/downloads.html)
- [Azure CLI](https://docs.microsoft.com/ja-jp/cli/azure/install-azure-cli)

## Terraform によるリソース配置

### 環境準備

この Terraform コードで Backend に Azure (Blob storage) を指定したい場合は、 `backend_override.tf.example` を参考に、`backend_override.tf` を配置すると、切替えが容易です。`*backend_override.tf` によるオーバーライドについては後述備考をご参考ください。

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
  "stapp_id_admin": "<Static Web apps resource ID (admin)>",
  "stapp_id_client": "<Static Web apps resource ID (client)>"
}
```

## GitHub Actions のワークフローの整備

ワークフローファイルは既にリポジトリに格納しているので、下記のシークレットを環境に合わせて設定しておきます。

| シークレット名 | 値（説明） |
|----|----|
| `AZURE_STATIC_WEB_APPS_API_TOKEN_BLACK_MUD_03F1EBC00` | デプロイ先の Static Web App の Deployment token を指定する |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN` | デプロイ先の Static Web App の Deployment token を指定する |

## Azure CLI によるアプリケーション設定の更新

（まとめ中）

| チャネル | 項目 | 説明 |
|----|----|----|
| LINEログイン | チャネルID | 「チャネル基本設定」タブ > 「基本設定」 > 「チャネルID」 |
| LINEログイン | LIFF ID | 「LIFF」タブ > 作成したLIFFアプリ > 「LIFF ID」 |
| LINEログイン | LIFF URL | 「LIFF」タブ > 作成したLIFFアプリ > 「LIFF URL」 |
| Messaging API | チャネルID | 「チャネル基本設定」タブ > 「基本設定」 > 「チャネルID」 |
| Messaging API | チャネルシークレット | 「チャネル基本設定」タブ > 「基本設定」 > 「チャネルシークレット」 |

```
LINE_LOGIN_LIFFID="<LINE Login LIFF ID>"
LINE_LOGIN_CHANNEL_ID="<LINE Login Channel ID>"
LINE_MESSAGING_API_CHANNEL_ID="<LINE Messaging Channel ID>"
LINE_MESSAGING_API_CHANNEL_SECRET="<LINE Messaging Channel secret>"
```

Azure Static Web App の app settings を反映します。

```bash
az rest --method put --headers "Content-Type=application/json" --uri "<Static Web apps resource ID (client)>/config/functionappsettings?api-version=2021-02-01" --body @client/api/local.settings.properties.json
```

```bash
az rest --method put --headers "Content-Type=application/json" --uri "<Static Web apps resource ID (admin)>/config/functionappsettings?api-version=2021-02-01" --body @admin/api/local.settings.properties.json
```

## 備考

### Terraform のオーバーライドの仕組み

Terraform では、`override.tf` または `_override.tf` ファイルを配置すると設定をオーバーライドできます。詳しくはこちら [Override Files - Configuration Language - Terraform by HashiCorp](https://www.terraform.io/docs/language/files/override.html) をご参考ください。
