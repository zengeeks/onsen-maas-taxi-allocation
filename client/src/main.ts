import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// グローバルエラーハンドラーを設定
app.config.errorHandler = (err, vm, info) => {
  console.error(err, info)
}

app.mount('#app')
