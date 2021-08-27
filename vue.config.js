module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    disableHostCheck: true, // ローカル環境 & ngrok でのデバッグの場合は、Host ヘッダー チェックの無効化が必要
  },
}
