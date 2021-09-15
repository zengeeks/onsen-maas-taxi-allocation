# LIFFアプリのエンドポイントを更新し、動作を確認する

控えておいた Azure Static Web App の URL を、LIFFアプリのエンドポイントとして設定します。

## LIFFアプリのエンドポイントを更新する

[LINE Developersコンソール](https://developers.line.biz/console/) を開き、作成したプロバイダーを開きます。

LINEログインチャネルの「LIFF」タブから、作成したLIFFアプリを開き、「Endpoint URL」を更新し、「更新」ボタンで保存します。

![LINE Developerコンソールで「LIFF」のエンドポイントを更新する](./images/line-dev-console_update-liff-endpoint.png)

## LIFFアプリを公開する

LINEログインチャネルのままで、画面上部の「非公開」を選択し、表示されたダイアログを確認し「公開」を選択します。

![LINEログインチャネルで、非公開を選択する](./images/line-dev-console_publich-line-login-channel_001.png)

![ダイアログを確認し「公開」を選択する](./images/line-dev-console_publich-line-login-channel_002.png)

![LINEログインチャネルが公開になった](./images/line-dev-console_publich-line-login-channel_003.png)

## リッチメニューに LIFFアプリを設定する

つぎにMessaging APIチャネルを開き、「チャネル基本設定」タブから、「LINE Official Account Manager」を開きます。

![Messaging APIチャネルの「チャネル基本設定」から「LINE Official Account Manager」を開く](./images/line-dev-console_basic-settings_open-account-manager.png)

「LINE OFficial Account Manager」の画面上部の「ホーム」を開き、左のメニューの「トークルーム管理」→「リッチメニュー」を開きます。「作成」ボタンからリッチメニューの作成を行います。

![「LINE OFficial Account Manager」でリッチメニューの作成を行う](./images/line-account-manager_create-rich-menu_001.png)

「表示設定」で下記を設定します。

| 項目 | 説明 |
|----|----|
| タイトル | 任意のタイトル（ `LIFFアプリ` など）を入力する |
| 表示期間 | 任意の期間を入力する |

![リッチメニューの表示設定を入力する](./images/line-account-manager_create-rich-menu_002.png)

「コンテンツ設定」で下記を設定します。

まず「テンプレートを選択」ボタンを選択し、「小」の1画面のテンプレート（左下）を選択して「選択」ボタンを選択します。

![リッチメニューのコンテンツ設定で、テンプレートの選択を行う](./images/line-account-manager_create-rich-menu_003.png)

![小の1画面のテンプレートを選択する](./images/line-account-manager_create-rich-menu_004.png)

「画像を作成」ボタンを選択し、下記の手順を行います。

![リッチメニューのコンテンツ設定で、画像の作成を行う](./images/line-account-manager_create-rich-menu_005.png)

- ダイアログ下部のアイコンから「背景色を追加」を選択し、任意の色を指定します。
- さらにダイアログ下部のアイコンから「テキストを追加」を選択し、任意の文字列（ `配車` など）を入力します。好みに応じて、「中央揃え」などで配置を整えてください。

![画像の作成で、背景色を追加する](./images/line-account-manager_create-rich-menu_006.png)

![画像の作成で、テキストを追加する](./images/line-account-manager_create-rich-menu_007.png)

![画像の作成で、テキストを編集し中央揃えにする](./images/line-account-manager_create-rich-menu_008.png)

「適用」ボタンを選択し、画像を適用するか確認されるので、「適用」を選択し進んでください。

![画像の作成を適用する](./images/line-account-manager_create-rich-menu_009.png)

![画像の作成の確認を適用を選択して進める](./images/line-account-manager_create-rich-menu_010.png)

「アクション」の「タイプ」を「リンク」に変更し、テキストボックスに控えておいた「LIFF URL」を入力します。「アクションラベル」に任意の文字列（ `タクシー配車サービス` など）を入力します。

以上の更新ができたら、「保存」ボタンから保存します。

![リッチメニューのコンテンツ設定で、アクションのリンクを設定し、保存する](./images/line-account-manager_create-rich-menu_011.png)

## 動作を確認する

Messageing APIチャネルの「Messaging API設定」タブを開き、QRコードを使ってこのチャネルをフレンド登録しましょう。

<img src="./images/line_demonstration_001.png" alt="作成した Messaging API チャネルをフレンド登録する" width="300"> <img src="./images/line_demonstration_002.png" alt="フレンド登録時の応答メッセージが届く" width="300">

チャットを開くと先ほど作成したリッチメニューが表示され、「配車」をタップします。初回はアクセス許可の確認を求められるので、確認し「Allow（許可）」を選択します。

<img src="./images/line_demonstration_003.png" alt="先ほど作成したリッチメニューが表示されている" width="300"> <img src="./images/line_demonstration_004.png" alt="初回はアクセス許可を求められるので許可する" width="300">

LIFFアプリが起動したら、各欄に入力し、「予約」ボタンから予約を行います。

<img src="./images/line_demonstration_005.png" alt="起動したLIFFアプリ" width="300"> <img src="./images/line_demonstration_006.png" alt="LIFFアプリで情報を入力し、配車予約をする" width="300">

しばらくすると下図のように「タクシー配車予約を受け付けました。」というメッセージが届けば成功です！ :tada:

<img src="./images/line_demonstration_007.png" alt="配車予約が受け付けられたメッセージが届く" width="300">

----

[README に戻る](./#5-liffアプリのエンドポイントを更新し、動作を確認する)
