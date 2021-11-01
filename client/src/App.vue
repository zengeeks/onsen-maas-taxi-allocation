<template>
  <div class="container">
    <TaxiReserve v-if="isLiffEnabled" :liff-display-name="liffDisplayName" />
    <div v-if="!isLiffEnabled">
      <div class="loading">
        <h2>Loading...</h2>
      </div>
    </div>
    <footer class="pt-5 text-muted text-center text-small">
      <p class="mb-1">&copy; 2021 温泉MaaS</p>
      <ul class="list-inline">
        <li class="list-inline-item">
          <a href="#">プライバシーポリシー</a>
        </li>
        <li class="list-inline-item">
          <a href="#">規約</a>
        </li>
        <li class="list-inline-item">
          <a href="#">サポート</a>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script lang="ts">
import liff from '@line/liff'
import TaxiReserve from './components/TaxiReserve.vue'
import VConsole from 'vconsole'
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    TaxiReserve,
  },
  setup() {
    const liffDisplayName = ref('')
    const isLiffEnabled = ref(false)

    // LIFF プロフィール取得
    const getProfile = async () => {
      const profile = await liff.getProfile()
      liffDisplayName.value = profile.displayName // LINEの名前
    }

    onMounted(async () => {
      // LIFF の初期化
      await liff.init({ liffId: import.meta.env.VITE_APP_LIFFID })
      if (liff.isLoggedIn()) {
        await getProfile()
      } else {
        liff.login()
      }

      // vConsole の初期化
      if (import.meta.env.VITE_APP_USE_VCONSOLE === 'true') {
        new VConsole({
          defaultPlugins: ['system', 'network', 'element', 'storage'],
          maxLogNumber: 1000,
          onReady: function () {
            console.log(import.meta.env.VITE_APP_USE_VCONSOLE)
            console.log('vConsole is ready.')
          },
          onClearLog: function () {
            console.log('vConsole on clearLog')
          },
        })
      }

      isLiffEnabled.value = true
    })

    return {
      liffDisplayName,
      isLiffEnabled,
    }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

a {
  color: #42b983;
}
</style>

<style scoped>
.loading {
  text-align: center;
  margin-top: 50px;
}
</style>
