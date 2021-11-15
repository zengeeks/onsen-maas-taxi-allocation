## 環境準備

この Terraform コードで Backend に Azure (Blob storage) を指定したい場合は、 `backend_override.tf.example` を参考に、`backend_override.tf` を配置しておくと、切替えが容易です。

- [Azure storage account](https://docs.microsoft.com/ja-jp/azure/storage/common/storage-account-overview) を作成し、`tfstate` の名前で Blob コンテナを作成する
- `backend.hcl.example` を `backend.hcl` としてコピーし、 `resource_group_name` と `storage_account_name` の値を指定する

上記の準備ができたら、下記を実行して Terraform プロジェクトの初期化を行います。

```bash
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

~~つぎに、GitHub Actions を連携してコードをデプロイします。~~

```bash
az staticwebapp reconnect \
  --resource-group ${RESOURCE_GROUP_NAME} \
  --name ${STAPP_NAME_CLIENT} \
  --source ${REPOSITORY_URL} \
  --branch ${REPOSITORY_BRANCH} \
  --login-with-github
```

Azure Static Web App の app settings を反映します。

```bash
az staticwebapp appsettings set \
  --resource-group ${RESOURCE_GROUP_NAME} \
  --name ${STAPP_NAME_CLIENT} \
  --setting-names \
    LINE_LOGIN_CHANNEL_ID="${LINE_LOGIN_CHANNEL_ID}" \
    LINE_MESSAGING_API_CHANNEL_ID="${LINE_MESSAGING_API_CHANNEL_ID}" \
    LINE_MESSAGING_API_CHANNEL_SECRET="${LINE_MESSAGING_API_CHANNEL_SECRET}" \
    COSMOS_CONNECTION="${COSMOS_CONNECTION}"
```
ref: https://github.com/Azure/azure-cli/issues/20108

```bash
az rest --method put --headers "Content-Type=application/json" --uri "/subscriptions/4e763e23-3cae-4f86-a6c7-b1db6decc68b/resourceGroups/rg-onsen/providers/Microsoft.Web/staticSites/stapp-onsen-client/config/functionappsettings?api-version=2021-02-01" --body @client/api/local.settings.properties.json
```

## 備考

Terraform では、`override.tf` または `_override.tf` ファイルを配置すると設定をオーバーライドできます。詳しくはこちら [Override Files - Configuration Language - Terraform by HashiCorp](https://www.terraform.io/docs/language/files/override.html) をご参考ください。
