<script lang="ts">
import TaxiReservationList from './components/TaxiReservationList.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    TaxiReservationList,
  },
})
</script>

<template>
  <TaxiReservationList />
</template>

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
