<script lang="ts">
import { defineComponent, computed, PropType, ref, watch } from 'vue'
import axios, { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import { TaxiReservation } from '../models/TaxiReservation'
import { TaxiReservationResponse } from '../models/TaxiReservationResponse'
import { TaxiChangeStatusPostRequestBody } from '../models/TaxiChangeStatusPostRequestBody'
import { TaxiChangeStatusResponse } from '../models/TaxiChangeStatusResponse'
import { SendMessagePostRequestBody } from '../models/SendMessagePostRequestBody'
import {
  isStatusRequested,
  isStatusAllocating,
  isStatusAllocated,
  isStatusCanceled,
  placeNameToDisplay,
  reservationStatuses,
  statusToDisplay,
} from '../helpers/taxiReservationHelper'

export default defineComponent({
  props: {
    reservationResponse: {
      type: Object as PropType<TaxiReservationResponse>,
      required: true,
    },
  },

  setup(props) {
    // プロパティの更新を反映する予約情報
    const reservation = computed((): TaxiReservation => {
      return {
        id: props.reservationResponse.id,
        userId: props.reservationResponse.userId,
        userName: props.reservationResponse.userName,
        departurePlaceText: placeNameToDisplay(
          parseInt(props.reservationResponse.departurePlace),
        ),
        arrivalPlaceText: placeNameToDisplay(
          parseInt(props.reservationResponse.arrivalPlace),
        ),
        userPhoneNumber: props.reservationResponse.userPhoneNumber,
        userNumberOfPassenger: props.reservationResponse.userNumberOfPassenger,
        numberOfTickets: props.reservationResponse.numberOfTickets,
        reservationDatetimeText: dayjs(
          props.reservationResponse.reservationDatetime,
        ).format('YYYY年MM月DD日 hh時mm分'),
        statusId: props.reservationResponse.reservationStatus,
        latestUpdateDatetimeText: dayjs(
          props.reservationResponse.latestUpdateDatetime,
        ).format('YYYY年MM月DD日 hh時mm分'),
      }
    })

    // ステータスの状態
    const reservationStatusId = ref<number>(
      props.reservationResponse.reservationStatus,
    )

    // 予約情報が更新された場合、ステータスを更新する
    const watchReservation = (reservation: TaxiReservation) => {
      reservationStatusId.value = reservation.statusId
    }

    // 予約情報の更新を監視する
    watch(reservation, watchReservation)

    // ユーザーへメッセージを通知する
    const sendLinePushMessage = async (userId: string, message: string) => {
      const response = await axios.post<SendMessagePostRequestBody>(
        '/api/sendmessage',
        {
          userId: userId,
          messageText: message,
        },
      )

      if (response.status == 200) {
        console.log('Succeed to notify the user')
      }
    }

    // ステータスを更新する
    const updateReservationStatus = async (statusId: number) => {
      const response: AxiosResponse<TaxiChangeStatusResponse> =
        await axios.post<TaxiChangeStatusPostRequestBody>(
          '/api/taxichangestatus',
          {
            id: reservation.value.id,
            userId: reservation.value.userId,
            reservationStatus: statusId,
          },
        )

      if (response.status == 200) {
        reservationStatusId.value = response.data.reservationStatus

        // ユーザーにステータス変更を通知する
        if (isStatusAllocated(response.data.reservationStatus)) {
          await sendLinePushMessage(
            response.data.userId,
            'タクシー配車を行いました。しばらくお待ちください。',
          )
        } else if (isStatusCanceled(response.data.reservationStatus)) {
          await sendLinePushMessage(
            response.data.userId,
            '申し訳ありません。タクシーを手配できませんでした。',
          )
        }
      }
    }

    // 手配を開始する
    const startAllocation = async () => {
      await updateReservationStatus(reservationStatuses['allocating'])
    }

    // 手配を完了する
    const completeAllocation = async () => {
      await updateReservationStatus(reservationStatuses['allocated'])
    }

    // 予約をキャンセルする
    const cancelAllocation = async () => {
      await updateReservationStatus(reservationStatuses['canceled'])
    }

    // 手配開始ボタンの無効化判定
    const isDisabledStartAllocationButton = (): boolean => {
      return (
        !isStatusRequested(reservationStatusId.value) ||
        isStatusCanceled(reservationStatusId.value)
      )
    }

    // 手配完了ボタンの無効化判定
    const isDisabledCompleteAllocationButton = (): boolean => {
      return (
        !isStatusAllocating(reservationStatusId.value) ||
        isStatusCanceled(reservationStatusId.value)
      )
    }

    // キャンセルボタンの無効判定
    const isDisabledCancelButton = (): boolean => {
      return (
        isStatusAllocated(reservationStatusId.value) ||
        isStatusCanceled(reservationStatusId.value)
      )
    }

    return {
      reservation,
      reservationStatusId,
      statusToDisplay,
      startAllocation,
      completeAllocation,
      cancelAllocation,
      isDisabledStartAllocationButton,
      isDisabledCompleteAllocationButton,
      isDisabledCancelButton,
    }
  },
})
</script>

<template>
  <tr v-if="reservation">
    <td class="font-monospace">{{ reservation.id }}</td>
    <td>{{ reservation.reservationDatetimeText }}</td>
    <td>{{ reservation.userName }}</td>
    <td>{{ reservation.userPhoneNumber }}</td>
    <td>{{ reservation.departurePlaceText }}</td>
    <td>{{ reservation.arrivalPlaceText }}</td>
    <td>{{ reservation.numberOfTickets }}</td>
    <td>{{ reservation.userNumberOfPassenger }}</td>
    <td>{{ statusToDisplay(reservationStatusId) }}</td>
    <td>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="isDisabledStartAllocationButton()"
        @click="startAllocation"
      >
        手配開始</button
      ><br />
      <button
        type="button"
        class="btn btn-primary"
        :disabled="isDisabledCompleteAllocationButton()"
        @click="completeAllocation"
      >
        手配完了</button
      ><br />
      <button
        type="button"
        class="btn btn-secondary"
        :disabled="isDisabledCancelButton()"
        @click="cancelAllocation"
      >
        キャンセル</button
      ><br />
    </td>
    <td>
      {{ reservation.latestUpdateDatetimeText }}
    </td>
  </tr>
</template>
