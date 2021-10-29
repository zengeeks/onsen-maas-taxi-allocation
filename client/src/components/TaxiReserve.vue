<template>
  <div id="taxiReserveWindow">
    <h2 class="text-center mt-5 mb-4">タクシー配車予約</h2>
    <form class="row row-cols-1 g-3" novalidate>
      <div class="col input-group">
        <span id="basic-addon1" class="input-group-text">名前</span>
        <input v-model="form.taxiUserName" type="text" class="form-control" />
      </div>
      <div class="col input-group">
        <span id="basic-addon1" class="input-group-text">電話番号</span>
        <input
          v-model="form.taxiUserPhoneNumber"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': v$.taxiUserPhoneNumber.$error }"
        />
        <div class="invalid-feedback">電話番号が入力されていません</div>
      </div>
      <div class="col">
        <label class="form-label" for="departurePlace">乗車場所</label>
        <select
          v-model="form.departurePlace"
          class="form-select"
          name="departurePlace"
          :class="{ 'is-invalid': v$.departurePlace.$error }"
        >
          <option v-for="place in places" :key="place.id" :value="place.id">
            {{ place.name }}
          </option>
        </select>
        <div class="invalid-feedback">選択してください</div>
      </div>
      <div class="col">
        <label class="form-label" for="arrivalPlace">降車場所</label>
        <select
          v-model="form.arrivalPlace"
          class="form-select"
          name="arrivalPlace"
          :class="{ 'is-invalid': v$.arrivalPlace.$error }"
        >
          <option v-for="place in places" :key="place.id" :value="place.id">
            {{ place.name }}
          </option>
        </select>
        <div class="invalid-feedback">選択してください</div>
      </div>
      <div v-if="isTicketMessageWindow" class="col">
        <div class="alert alert-info">
          必要なチケット枚数は {{ numberOfTickets }} 枚です
        </div>
      </div>
      <div class="col">
        <label for="taxiDeparturePlace" class="form-label">乗車人数</label>
        <select
          v-model="form.taxiNumberOfPassenger"
          class="form-select"
          :class="{ 'is-invalid': v$.taxiNumberOfPassenger.$error }"
        >
          <option value="1" selected>1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <div class="invalid-feedback">選択してください</div>
      </div>
      <div class="col input-group">
        <span id="basic-addon1" class="input-group-text">同乗者</span>
        <input
          v-model="form.taxiPassengers"
          type="text"
          class="form-control"
          aria-label="Passengers"
          aria-describedby="basic-addon1"
        />
      </div>
      <div class="col input-group">
        <button
          type="button"
          class="w-100 btn btn-primary btn-lg"
          @click="reserve"
        >
          予約
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import liff from '@line/liff'
import axios, { AxiosResponse } from 'axios'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { defineComponent, ref, computed } from 'vue'
import { TaxiReservation } from '../api/models/TaxiReservation'
import { Message } from '../api/models/Message'

export default defineComponent({
  props: {
    liffDisplayName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // form data
    const form = ref({
      taxiUserName: props.liffDisplayName,
      taxiUserPhoneNumber: '',
      taxiNumberOfPassenger: '',
      taxiPassengers: '',
      departurePlace: '',
      arrivalPlace: '',
    })

    // constant
    const tickets = [
      { number: 1 },
      { number: 2 },
      { number: 3 },
      { number: 4 },
      { number: 5 },
      { number: 6 },
    ] // 1->2, 1->3, 1->4, 2->3, 2->4, 3->4

    const places = [
      { id: '1', name: '観光会館' },
      { id: '2', name: '○○駅' },
      { id: '3', name: '○○温泉' },
      { id: '4', name: '○○カフェ' },
    ]

    // computed values
    const isTicketMessageWindow = computed(() => {
      return form.value.departurePlace && form.value.arrivalPlace
    })

    const numberOfTickets = computed(() => {
      const idx1 = Number(form.value.departurePlace)
      const idx2 = Number(form.value.arrivalPlace)
      if (idx1 === idx2) {
        return 0
      }
      return tickets[(idx1 - 1) * 4 - (idx1 * (idx1 + 1)) / 2 + idx2 - 1].number
    })

    // validation rules
    const rules = {
      taxiUserPhoneNumber: { required },
      taxiNumberOfPassenger: { required },
      departurePlace: { required },
      arrivalPlace: { required },
    }
    const v$ = useVuelidate(rules, form.value)

    // 予約の関数
    const reserve = async () => {
      // バリデーション実行
      const isFormCorrect = await v$.value.$validate()
      if (!isFormCorrect) {
        console.log('バリデーションエラー: ', form.value)
        return
      }

      // LIFF の ID トークンを取得
      const liffUserIdToken = liff.getIDToken()
      if (!liffUserIdToken) {
        console.log('IDトークン取得失敗')
        return
      }

      // payload
      const taxiReservation: TaxiReservation = {
        userIdToken: liffUserIdToken,
        userName: form.value.taxiUserName,
        departurePlace: form.value.departurePlace,
        arrivalPlace: form.value.arrivalPlace,
        userPhoneNumber: form.value.taxiUserPhoneNumber,
        userNumberOfPassenger: Number(form.value.taxiNumberOfPassenger),
        userPassengers: form.value.taxiPassengers,
        numberOfTickets: Number(numberOfTickets.value),
        reservationDatetime: new Date().toISOString(),
      }

      // taxireserve の API を実行
      const response: AxiosResponse<Message> = await axios.post(
        '/api/taxireserve',
        taxiReservation,
      )
      await sendMessage({
        userId: response.data.userId,
        messageText: 'タクシー配車予約を受け付けました。',
      })
      liff.closeWindow()
    }

    // LINEにメッセージを送信する関数
    const sendMessage = async (message: Message) => {
      if (!liff.isLoggedIn()) {
        return
      }

      // sendmessage の API を実行
      await axios.post('/api/sendmessage', message)
    }

    // return
    return {
      form,
      isTicketMessageWindow,
      numberOfTickets,
      places,
      v$,
      reserve,
    }
  },
})
</script>

<style scoped>
.input-group-text {
  min-width: 6em;
}

button.w-100 {
  letter-spacing: 2em;
  text-indent: 2em;
}
</style>
