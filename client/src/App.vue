<template>
  <div id="app" class="container">
    <TaxiReserve />
  </div>
</template>

<script>
import TaxiReserve from './TaxiReserve.vue'
import VConsole from 'vconsole'

export default {
  name: 'App',
  components: {
    TaxiReserve,
  },
  mounted: function () {
    this.initVConsole()
  },
  methods: {
    // vConsole 初期化
    initVConsole() {
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
    },
  },
}
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
