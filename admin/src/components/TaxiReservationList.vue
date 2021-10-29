<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import axios, { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import TaxiReservationRow from './TaxiReservationRow.vue'
import { TaxiReservationResponse } from '../models/TaxiReservationResponse'
import { TaxiReservationResponseList } from '../models/TaxiReservationResponseList'

export default defineComponent({
  components: {
    TaxiReservationRow,
  },

  data() {
    return {
      taxiReservationResponseList: [],
    } as TaxiReservationResponseList
  },

  created: function () {
    this.updateTaxiReservationList()
    this.refresh()
  },

  methods: {
    // 継続的な情報の更新を行う
    refresh() {
      setInterval(this.updateTaxiReservationList, 10000)
    },

    // タクシー予約一覧を取得する
    async updateTaxiReservationList() {
      const now = new Date()
      const fromDate = now.toISOString()
      const toDate = dayjs(now).hour(23).minute(59).second(59).toISOString()
      let query = new URLSearchParams()
      query.append('fromDate', fromDate)
      query.append('toDate', toDate)

      const response: AxiosResponse<TaxiReservationResponse[]> =
        await axios.get('/api/taxireservelist?' + query.toString())

      if (response.status == 200 && Array.isArray(response.data)) {
        this.taxiReservationResponseList = response.data
        console.log('updated')
      }
    },
  },
})
</script>

<template>
  <div class="container-lg">
    <div class="row text-center mt-5 mb-4">
      <h2>タクシー予約一覧</h2>
    </div>
    <div class="row">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">予約受付日時</th>
            <th scope="col">氏名</th>
            <th scope="col">電話番号</th>
            <th scope="col">乗車場所</th>
            <th scope="col">降車場所</th>
            <th scope="col">チケット枚数</th>
            <th scope="col">乗車人数</th>
            <th scope="col">現在の状態</th>
            <th scope="col">操作</th>
            <th scope="col">最終更新日時</th>
          </tr>
        </thead>
        <tbody>
          <TaxiReservationRow
            v-for="reservationResponse in taxiReservationResponseList"
            :key="reservationResponse.id"
            :reservation-response="reservationResponse"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
