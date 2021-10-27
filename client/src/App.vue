<template>
  <div id="app" class="container">
    <TaxiReserve />
  </div>
</template>

<script lang="ts">
import TaxiReserve from './components/TaxiReserve.vue'
import VConsole from 'vconsole'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    TaxiReserve,
  },
  setup() {
    onMounted(() => {
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
    })
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
