<script setup lang="ts">
import { TaxiReservationResponse } from '../models/TaxiReservationResponse'

defineProps<{ reservationResponse: TaxiReservationResponse }>()
</script>

<script lang="ts">
import axios from 'axios'
import dayjs from 'dayjs'
import { defineComponent } from '@vue/runtime-core'
import { TaxiReservation } from '../models/TaxiReservation'
import { TaxiChangeStatusPostRequestBody } from '../models/TaxiChangeStatusPostRequestBody'

export default defineComponent({
  data() {
    return {
      reservation: null,
      status: 0,
    } as { reservation: null | TaxiReservation; status: number }
  },

  watch: {
    reservationResponse: function (val) {
      this.reservation = new TaxiReservation(val)
    },

    status: async function (status) {
      await this.updateReservationStatus(status)
    },
  },

  methods: {
    // ステータスを更新する
    async updateReservationStatus(status: number) {
      if (!this.reservation) {
        return
      }

      const response = await axios.post<TaxiChangeStatusPostRequestBody>(
        '/api/taxichangestatus',
        {
          id: this.reservation.id,
          userId: this.reservation.userId,
          reservationStatus: status,
        },
      )
      if (response.status == 200) {
        this.reservation.updateStatus(status)

        // TODO: ユーザーにステータス変更を通知する
        await this.sendLinePushMessage()
      }
    },

    // 手配を開始する
    async startAllocation() {
      if (this.reservation) {
        this.status = this.reservation.statuses['allocating']
      }
    },

    // 手配を完了する
    async completeAllocation() {
      if (this.reservation) {
        this.status = this.reservation.statuses['allocated']
      }
    },

    // 予約をキャンセルする
    async cancelAllocation() {
      if (this.reservation) {
        this.status = this.reservation.statuses['canceled']
      }
    },

    // TODO: ステータス更新をユーザーへ通知する
    async sendLinePushMessage() {
      console.log('TODO: send a message to the user')
    },

    // 日時の書式文字列を返す
    getDateFormatedText(date: string | Date, format: string) {
      return dayjs(date).format(format)
    },
  },
})
</script>

<template>
  <tr v-if="reservation">
    <td>{{ reservation.id }}</td>
    <td>
      {{
        getDateFormatedText(
          reservation.reservationDatetime,
          'YYYY年MM月DD日 hh時mm分',
        )
      }}
    </td>
    <td>{{ reservation.userName }}</td>
    <td>{{ reservation.userPhoneNumber }}</td>
    <td>{{ reservation.placeNameToDisplay(reservation.departurePlace) }}</td>
    <td>{{ reservation.placeNameToDisplay(reservation.arrivalPlace) }}</td>
    <td>{{ reservation.numberOfTickets }}</td>
    <td>{{ reservation.userNumberOfPassenger }}</td>
    <td>{{ reservation.statusToDisplay(reservation.status) }}</td>
    <td>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!reservation.isRequested() || reservation.isCanceled()"
        @click="startAllocation"
      >
        手配開始
      </button>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!reservation.isAllocating() || reservation.isCanceled()"
        @click="completeAllocation"
      >
        手配完了
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        :disabled="reservation.isCanceled()"
        @click="cancelAllocation"
      >
        キャンセル
      </button>
    </td>
    <td>
      {{ getDateFormatedText(reservation.updated, 'YYYY年MM月DD日 hh時mm分') }}
    </td>
  </tr>
</template>
