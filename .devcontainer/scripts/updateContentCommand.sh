#!/bin/bash

## Setup client

pushd client
npm install
popd

## Setup client/api

pushd client/api
npm install
npm run build
popd

## Setup admin

pushd admin
npm install
popd

## Setup admin/api

pushd admin/api
npm install
npm run build
popd
