import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import axios, { AxiosError } from 'axios'

interface SendMessageHttpRequest extends HttpRequest {
  body: {
    userId: string
    messageText: string
  }
}

interface LineChannelAccessTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

interface LineAccessTokenErrorRespone {
  error: string
  error_description: string
}

interface LineMessagePushErrorResponse {
  message: string
}

const sendmessage: AzureFunction = async function (
  context: Context,
  req: SendMessageHttpRequest,
): Promise<void> {
  // メッセージ送信用オブジェクトを作成
  const message = {
    to: req.body.userId,
    messages: [
      {
        type: 'text',
        text: req.body.messageText,
      },
    ],
  }

  // 環境変数から LINE の接続情報を取得
  const lineMessagingChannelId = process.env.LINE_MESSAGING_API_CHANNEL_ID
  if (!lineMessagingChannelId) {
    context.res = {
      status: 500,
      body: 'LINE Messaging API channel ID is not set',
    }
    return
  }
  const lineMessagingChannelSecret =
    process.env.LINE_MESSAGING_API_CHANNEL_SECRET
  if (!lineMessagingChannelSecret) {
    context.res = {
      status: 500,
      body: 'LINE Messaging API channel secret is not set',
    }
    return
  }

  // LINE チャネルアクセストークン取得
  let lineChannelAccessToken = ''

  try {
    const lineChannelAccessTokenParams = new URLSearchParams()
    lineChannelAccessTokenParams.append('grant_type', 'client_credentials')
    lineChannelAccessTokenParams.append('client_id', lineMessagingChannelId)
    lineChannelAccessTokenParams.append(
      'client_secret',
      lineMessagingChannelSecret,
    )
    const lineChannelAccessTokenResponse =
      await axios.post<LineChannelAccessTokenResponse>(
        'https://api.line.me/v2/oauth/accessToken',
        lineChannelAccessTokenParams,
      )

    if (!lineChannelAccessTokenResponse) {
      const errorMessage = 'The access token of LINE Messaging API is empty'
      context.log(errorMessage)
      context.res = {
        status: 500,
        body: errorMessage,
      }
      return
    }

    lineChannelAccessToken = lineChannelAccessTokenResponse.data.access_token
  } catch (error) {
    const errorMessage = 'Failed to fetch access token of LINE Messaging API'
    context.log(errorMessage)

    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 400) {
        context.log(`status: ${error.response.status}`)
        const errorData = <LineAccessTokenErrorRespone>error.response.data
        context.log(`${errorData.error} - ${errorData.error_description}`)
      } else {
        context.log(error.toJSON())
      }
    }

    context.res = {
      status: 500,
      body: errorMessage,
    }
    return
  }

  // メッセージ送信
  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      JSON.stringify(message),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + lineChannelAccessToken,
        },
      },
    )
  } catch (error) {
    const errorMessage = 'Failed to push a message to LINE'
    context.log(errorMessage)

    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 400) {
        context.log(`status: ${error.response.status}`)
        context.log(<LineMessagePushErrorResponse>error.response.data.message)
      } else {
        context.log(error.toJSON())
      }
    }

    context.res = {
      status: 500,
      body: errorMessage,
    }
    return
  }

  // Function のレスポンスを返す
  context.res = {
    body: 'message sent',
  }
}

export default sendmessage
