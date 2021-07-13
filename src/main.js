import Vue from 'vue'
import App from './App.vue'
import TaxiReserve from './TaxiReserve.vue'

Vue.component('app-taxi-reserve', TaxiReserve)
new Vue({
  el: '#app',
  render: h => h(App)
})
