#!/bin/bash

# Required an environment variable ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON that includes the following json
# 
# {
#   "LINE_LOGIN_CHANNEL_ID": "",
#   "LIFFID": "",
#   "LINE_MESSAGING_API_CHANNEL_ID": "",
#   "LINE_MESSAGING_API_CHANNEL_SECRET": "",
#   "COSMOSDB_ENDPOINT": "",
#   "COSMOSDB_KEY": "",
#   "COSMOS_CONNECTION": ""
# }

if [ -z "$ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON" ]; then
  echo "Required environment variable ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON is missing"
  echo "Exit without setting up local.settings.json and .env.local"
  exit
fi

##

LINE_LOGIN_CHANNEL_ID=$(echo ${ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON} | jq -r ".LINE_LOGIN_CHANNEL_ID")
LIFFID=$(echo ${ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON} | jq -r ".LIFFID")
LINE_MESSAGING_API_CHANNEL_ID=$(echo ${ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON} | jq -r ".LINE_MESSAGING_API_CHANNEL_ID")
LINE_MESSAGING_API_CHANNEL_SECRET=$(echo ${ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON} | jq -r ".LINE_MESSAGING_API_CHANNEL_SECRET")
COSMOSDB_ENDPOINT=$(echo ${ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON} | jq -r ".COSMOSDB_ENDPOINT")
COSMOSDB_KEY=$(echo ${ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON} | jq -r ".COSMOSDB_KEY")
COSMOS_CONNECTION=$(echo ${ONSEN_MAAS_TAXI_ALLOCATION_ENV_JSON} | jq -r ".COSMOS_CONNECTION")

##

if [ ! -f "admin/api/local.settings.json" ]; then
  echo "Make admin/api/local.settings.json"
  pushd admin/api
  jq ".Values.LINE_MESSAGING_API_CHANNEL_ID = \"${LINE_MESSAGING_API_CHANNEL_ID}\" | "`
  `".Values.LINE_MESSAGING_API_CHANNEL_SECRET = \"${LINE_MESSAGING_API_CHANNEL_SECRET}\" | "`
  `".Values.COSMOSDB_ENDPOINT = \"${COSMOSDB_ENDPOINT}\" | "`
  `".Values.COSMOSDB_KEY = \"${COSMOSDB_KEY}\"" local.settings.example.json > local.settings.json
  popd
fi


##

if [ ! -f "client/.env.local" ]; then
  echo "Make client/.env.local"
  pushd client
  cp .env .env.local
  sed -i -E "s/^(VITE_APP_LIFFID=).+$/\1${LIFFID}/g" .env.local
  popd
fi

##

if [ ! -f "client/api/local.settings.json" ]; then
  echo "Make client/api/local.settings.json"
  pushd client/api
  jq ".Values.LINE_LOGIN_CHANNEL_ID = \"${LINE_LOGIN_CHANNEL_ID}\" | "`
  `".Values.LINE_MESSAGING_API_CHANNEL_ID = \"${LINE_MESSAGING_API_CHANNEL_ID}\" | "`
  `".Values.LINE_MESSAGING_API_CHANNEL_SECRET = \"${LINE_MESSAGING_API_CHANNEL_SECRET}\" | "`
  `".Values.COSMOS_CONNECTION =\"${COSMOS_CONNECTION}\"" local.settings.example.json > local.settings.json
  popd
fi
