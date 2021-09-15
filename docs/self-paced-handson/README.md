# セルフペースハンズオン資料

この資料は、[【地方活性化！】MaaS Hands-On with Microsoft Azure【ミニアプリ】](https://linedevelopercommunity.connpass.com/event/220376/) で行うハンズオンの手順をまとめたものです。

## 概要

このリポジトリでは、温泉MaaS を想定するサービスの一つとして、タクシー配車予約サービスをLINE LIFFアプリを用いて実装したアプリケーションのサンプルコードをホストしています。

### 事前の準備

本ハンズオンを進めるにあたり、下記のアカウントをご用意ください。

| 必要なアカウント | 説明 |
|----|----|
| LINE アカウント | [LINE Developersコンソール](https://developers.line.biz/console/)で作業ができるように、LINEアカウントまたはLINEビジネスアカウントをご用意ください。詳細は、[LINE Developersコンソールへのログイン](https://developers.line.biz/ja/docs/line-developers-console/login-account/) をご参考ください。 |
| GitHub アカウント | リポジトリを利用するために、アカウントが必要です。これからご準備する方は、[サインアップ](https://github.com/signup) からアカウントを作成してください。 |
| Microsoft Azure アカウント | LIFFアプリ（静的サイト）とデータベースをホストするために、Microsoft Azure を利用するので、アカウントが必要です。これからご準備する方は、[Azure の無料アカウントを今すぐ作成 \| Microsoft Azure](https://azure.microsoft.com/ja-jp/free/) より作成ください。 |

### 流れ

1. [LIFFアプリに利用するチャネルを作成する](#1-liffアプリに利用するチャネルを作成する)
2. [GitHubリポジトリを準備する](#2-githubリポジトリを準備する)
3. [Azure のリソースを作成する](#3-azure-のリソースを作成する)
4. [ワークフローを更新する](#4-ワークフローを更新する)
5. [LIFFアプリのエンドポイントを更新し、動作を確認する](#5-liffアプリのエンドポイントを更新し、動作を確認する)
6. ([作成したリソースを削除する](#6-作成したリソースを削除する))

----

## 1. LIFFアプリに利用するチャネルを作成する

まず、LIFFアプリを利用できるように、LINE Developersコンソールからチャネルの作成を行います。

- [LIFFアプリに利用するチャネルを作成する](./create-line-channels.md)

## 2. GitHubリポジトリを準備する

 つぎに、本リポジトリをフォークして、CI/CDで連携するためのリポジトリを準備をします。

- [GitHubリポジトリを準備する](./prepare-your-repository.md)

## 3. Azure のリソースを作成する

Azure のリソースを作成して、アプリケーションを稼働させる環境を整えます。

- [Azure のリソースを作成する](./create-azure-resources.md)

## 4. ワークフローを更新する

LIFFアプリ（静的サイト）に LIFF ID を伝搬させるために、ワークフローを更新します。

- [ワークフローを更新する](./update-workflow.md)

## 5. LIFFアプリのエンドポイントを更新し、動作を確認する

控えておいた Azure Static Web App の URL を、LIFFアプリのエンドポイントとして設定します。

それでは、最後に実際にLINEアプリから、タクシー配車予約サービスの動作確認をしてみましょう！

- [LIFFアプリのエンドポイントを更新する](./update-liff-endpoint-and-congrats.md)

## (6. 作成したリソースを削除する)

作成したリソースを削除する場合は、下記をご参考ください。

- [作成したリソースを削除する](./cleanup-resources.md)