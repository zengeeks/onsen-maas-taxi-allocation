<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios, { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import TaxiReservationRow from './TaxiReservationRow.vue'
import { TaxiReservationResponse } from '../models/TaxiReservationResponse'

export default defineComponent({
  components: {
    TaxiReservationRow,
  },

  setup() {
    const taxiReservationResponseList = ref<TaxiReservationResponse[]>([])

    // タクシー予約一覧を取得する
    const getTaxiReservationList = async () => {
      const now = new Date()
      const fromDate = now.toISOString()
      const toDate = dayjs(now).hour(23).minute(59).second(59).toISOString()

      const response: AxiosResponse<TaxiReservationResponse[]> =
        await axios.get('/api/taxireservelist', {
          params: { fromDate, toDate },
        })

      if (response.status == 200 && Array.isArray(response.data)) {
        taxiReservationResponseList.value = response.data
      }
    }

    // 継続的な情報の更新を行う
    const refresh = () => {
      setInterval(getTaxiReservationList, 10000)
    }

    return {
      taxiReservationResponseList,
      getTaxiReservationList,
      refresh,
    }
  },

  created: function () {
    this.getTaxiReservationList()
    this.refresh()
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
