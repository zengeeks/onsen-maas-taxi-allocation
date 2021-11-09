## 環境準備

この Terraform コードで Backend に Azure (Blob storage) を指定したい場合は、 `backend_override.tf.example` を参考に、`backend_override.tf` を配置すると、切替えが容易です。`*backend_override.tf` によるオーバーライドについては後述尾行をご参考ください。

- [Azure storage account](https://docs.microsoft.com/ja-jp/azure/storage/common/storage-account-overview) を作成し、`tfstate` の名前で Blob コンテナを作成する
- `backend_override.tf.example` を `backend_override.tf` としてコピーし、 `resource_group_name` と `storage_account_name` の値を指定する

上記の準備ができたら、下記を実行して Terraform プロジェクトの初期化を行います。

```bash
# Azure のサブスクリプションにログインする
az login

# Terraform プロジェクトの初期化を行う
terraform init
```

## デプロイ

リソースをデプロイしたのち、Azure Static Web App の設定を行います。

```bash
terraform plan
terraform apply
```

各種設定値を環境変数で控えておきます。

```bash
OUTPUTS=`terraform output -json`

RESOURCE_GROUP_NAME=`echo ${OUTPUTS} | jq -r .resource_group_name.value`

STAPP_NAME_CLIENT=`echo ${OUTPUTS} | jq -r .stapp_name_client.value`
COSMOS_CONNECTION=`echo ${OUTPUTS} | jq -r .cosmosdb_connection_string.value`

STAPP_NAME_ADMIN=`echo ${OUTPUTS} | jq -r .stapp_name_admin.value`
COSMOSDB_ENDPOINT=`echo ${OUTPUTS} | jq -r .cosmosdb_endpoint.value`
COSMOSDB_KEY=`echo ${OUTPUTS} | jq -r .cosmosdb_key.value`
COSMOSDB_DATABASE=`echo ${OUTPUTS} | jq -r .cosmos_database_name.value`
COSMOSDB_CONTAINER=`echo ${OUTPUTS} | jq -r .cosmos_container_name.value`

REPOSITORY_URL="https://github.com/<Your GitHub account>/onsen-maas-taxi-allocation"
REPOSITORY_BRANCH="main"

LINE_LOGIN_LIFFID="<LINE Login LIFF ID>"
LINE_LOGIN_CHANNEL_ID="<LINE Login Channel ID>"
LINE_MESSAGING_API_CHANNEL_ID="<LINE Messaging Channel ID>"
LINE_MESSAGING_API_CHANNEL_SECRET="<LINE Messaging Channel secret>"
```

ワークフローファイルは既にリポジトリに格納しているので、下記のシークレットを環境に合わせて設定しておきます。

| シークレット名 | 値（説明） |
|----|----|
| `AZURE_STATIC_WEB_APPS_API_TOKEN_BLACK_MUD_03F1EBC00` | デプロイ先の Static Web App の Deployment token を指定する |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN` | デプロイ先の Static Web App の Deployment token を指定する |

Azure Static Web App の app settings を反映します。

```bash
az rest --method put --headers "Content-Type=application/json" --uri "<Static Web apps resource ID (client)>/config/functionappsettings?api-version=2021-02-01" --body @client/api/local.settings.properties.json
```

```bash
az rest --method put --headers "Content-Type=application/json" --uri "<Static Web apps resource ID (admin)>/config/functionappsettings?api-version=2021-02-01" --body @admin/api/local.settings.properties.json
```

## 備考

Terraform では、`override.tf` または `_override.tf` ファイルを配置すると設定をオーバーライドできます。詳しくはこちら [Override Files - Configuration Language - Terraform by HashiCorp](https://www.terraform.io/docs/language/files/override.html) をご参考ください。
