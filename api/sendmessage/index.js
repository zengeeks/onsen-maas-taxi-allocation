const fetch = require('node-fetch');

module.exports = async function (context, req) {

    // メッセージ送信用オブジェクトを作成
    const message = {
        to: req.body.userId,
        messages: [
            {
                "type": "text",
                "text": req.body.messageText
            }
        ]
    }

    // LINE チャネルアクセストークン取得（成功時は channelAccessToken をセット）
    const channelAccessTokenEndpoint = "https://api.line.me/v2/oauth/accessToken";
    const channelAccessTokenParams = new URLSearchParams();
    channelAccessTokenParams.append('grant_type', 'client_credentials');
    channelAccessTokenParams.append('client_id', process.env.LINE_MESSAGING_API_CHANNEL_ID);
    channelAccessTokenParams.append('client_secret', process.env.LINE_MESSAGING_API_CHANNEL_SECRET);
    let channelAccessToken = '';

    try {
        const response = await fetch(channelAccessTokenEndpoint, { method: 'POST', body: channelAccessTokenParams });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`LINE Access Token API Error: ${data.error} - ${data.error_description}`);
        }
        channelAccessToken = data.access_token;
    } catch (e) {
        context.log('Error: ', e);
        context.res = {
            status: 500,
            body: e.message
        }
        return;
    }

    // メッセージ送信
    const messageEndpoint = 'https://api.line.me/v2/bot/message/push';
    const messageOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + channelAccessToken
        },
        body: JSON.stringify(message)
    };

    try {
        const response = await fetch(messageEndpoint, messageOptions);
        data = await response.json();
        if (!response.ok) {
            throw new Error(`LINE Message API Error: ${data.message}`);
        }
    } catch (e) {
        context.log('Error: ', e);
        context.res = {
            status: 500,
            body: e.message
        }
        return;
    }

    // Function のレスポンスを返す
    context.res = {
        body: "message sent"
    };
};