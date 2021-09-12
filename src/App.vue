<template>
  <div id="app">
    <TaxiReserve />
  </div>
</template>

<script>
import TaxiReserve from './TaxiReserve.vue'

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
      if (process.env.VUE_APP_USE_VCONSOLE3 === 'true') {
        window.vConsole = new window.VConsole({
          defaultPlugins: ['system', 'network', 'element', 'storage'],
          maxLogNumber: 1000,
          onReady: function () {
            console.log(process.env.VUE_APP_USE_VCONSOLE)
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

a {
  color: #42b983;
}
</style>
