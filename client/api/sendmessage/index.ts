import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import fetch from 'node-fetch';
import { JWS } from 'node-jose';

const sendmessage: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

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
    const privateKey = process.env.LINE_ASSERTION_SIGNATURE_SECRET
    if (!privateKey) {
        throw new Error('LINE_ASSERTION_SIGNATURE_SECRET not set.')
    }

    const kid = process.env.LINE_ASSERTION_SIGNATURE_KEY_ID
    if (!kid) {
        throw new Error('LINE_ASSERTION_SIGNATURE_KEY_ID not set.')
    }

    const channelId = process.env.LINE_MESSAGING_API_CHANNEL_ID
    if (!channelId) {
        throw new Error('LINE_MESSAGING_API_CHANNEL_ID not set.')
    }

    const header = {
        alg: 'RS256',
        typ: 'JWT',
        kid,
    }

    const payload = {
        iss: channelId,
        sub: channelId,
        aud: 'https://api.line.me/',
        exp: Math.floor(new Date().getTime() / 1000) + 60 * 30,
        token_exp: 60 * 60 * 24 * 30,
    }

    const jwt = await JWS.createSign(
        { format: 'compact', fields: header },
        JSON.parse(privateKey),
    )
        .update(JSON.stringify(payload))
        .final()
    
    const channelAccessTokenParams = new URLSearchParams();
    let channelAccessToken = '';
    channelAccessTokenParams.append('grant_type', 'client_credentials')
    channelAccessTokenParams.append(
        'client_assertion_type',
        'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    )
    channelAccessTokenParams.append('client_assertion', jwt as unknown as string)

    try {
        const response = await fetch('https://api.line.me/oauth2/v2.1/token', { method: 'POST', body: channelAccessTokenParams });
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
        const data = await response.json();
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

export default sendmessage;