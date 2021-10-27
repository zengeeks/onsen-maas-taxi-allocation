<script setup lang="ts">
import { TaxiReservationResponse } from '../models/TaxiReservationResponse'

defineProps<{ reservationResponse: TaxiReservationResponse }>()
</script>

<script lang="ts">
import axios from 'axios'
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

    async startAllocation() {
      this.status = 2
    },

    async completeAllocation() {
      this.status = 3
    },

    async cancelAllocation() {
      this.status = 4
    },

    // TODO: ステータス更新をユーザーへ通知する
    async sendLinePushMessage() {
      console.log('TODO: send a message to the user')
    },
  },
})
</script>

<template>
  <tr v-if="reservation">
    <td>{{ reservation.id }}</td>
    <td>{{ reservation.reservationDatetime }}</td>
    <td>{{ reservation.userName }}</td>
    <td>{{ reservation.userPhoneNumber }}</td>
    <td>{{ reservation.departurePlace }}</td>
    <td>{{ reservation.arrivalPlace }}</td>
    <td>{{ reservation.numberOfTickets }}</td>
    <td>{{ reservation.userNumberOfPassenger }}</td>
    <td>{{ reservation.status }}</td>
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
    <td>{{ reservation.updated }}</td>
  </tr>
</template>
