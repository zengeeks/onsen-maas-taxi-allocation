<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import axios, { AxiosResponse } from 'axios'
import { TaxiReservation } from '../models/TaxiReservation'
import { TaxiReservationListData } from '../models/TaxiReservationListData'

export default defineComponent({
  components: {
  },

  data() {
    return {
      taxiReservationList: [],
    } as TaxiReservationListData
  },

  created: async function () {
    this.updateTaxiReservationList()
    this.refresh()
  },

  methods: {
    // 継続的な情報の更新を行う
    async refresh() {
      setInterval(this.updateTaxiReservationList, 10000);
    },

    // タクシー予約一覧を取得する
    async updateTaxiReservationList() {
      const now = new Date()
      const fromDate = now.toISOString()
      const toDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
      ).toISOString()
      let query = new URLSearchParams()
      query.append('fromDate', fromDate)
      query.append('toDate', toDate)

      const response: AxiosResponse<TaxiReservation[]> = await axios.get(
        '/api/taxireservelist?' + query.toString(),
      )
      this.taxiReservationList = response.data
    },

    // TODO: ステータスを更新する
    async updateStatus() {},

    // TODO: ステータス更新をユーザーへ通知する
    async sendLinePushMessage() {},
  },
})
</script>

<template>
  <div class="container">
    <div class="text-center mt-5 mb-4">
      <h2>タクシー予約一覧</h2>
    </div>
    <table class="table">
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
        <tr v-for="reservation in taxiReservationList" :key="reservation.id">
          <td>{{ reservation.id }}</td>
          <td>{{ reservation.reservationDatetime }}</td>
          <td>{{ reservation.userName }}</td>
          <td>{{ reservation.userPhoneNumber }}</td>
          <td>{{ reservation.departurePlace }}</td>
          <td>{{ reservation.arrivalPlace }}</td>
          <td>{{ reservation.numberOfTickets }}</td>
          <td>{{ reservation.userNumberOfPassenger }}</td>
          <td>{{ reservation.reservationStatus }}</td>
          <td>button</td>
          <td>{{ reservation.latestUpdateDatetime }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
