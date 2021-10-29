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
          v-model="form.selectedDeparturePlace"
          class="form-select"
          name="departurePlace"
          :class="{ 'is-invalid': v$.selectedDeparturePlace.$error }"
          @change="getTicketNumber"
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
          v-model="form.selectedArrivalPlace"
          class="form-select"
          name="arrivalPlace"
          :class="{ 'is-invalid': v$.selectedArrivalPlace.$error }"
          @change="getTicketNumber"
        >
          <option v-for="place in places" :key="place.id" :value="place.id">
            {{ place.name }}
          </option>
        </select>
        <div class="invalid-feedback">選択してください</div>
      </div>
      <div v-if="form.isTicketMessageWindow" class="col">
        <div class="alert alert-info">
          必要なチケット枚数は {{ form.selectedTicketNumber }} 枚です
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
    <footer class="pt-5 text-muted text-center text-small">
      <p class="mb-1">&copy; 2021 温泉MaaS</p>
      <ul class="list-inline">
        <li class="list-inline-item">
          <a href="#">プライバシーポリシー</a>
        </li>
        <li class="list-inline-item">
          <a href="#">規約</a>
        </li>
        <li class="list-inline-item">
          <a href="#">サポート</a>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script lang="ts">
import liff from '@line/liff'
import axios, { AxiosResponse } from 'axios'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { defineComponent, ref, onMounted } from 'vue'
import { TaxiReservation } from '../api/models/TaxiReservation'
import { Message } from '../api/models/Message'

export default defineComponent({
  setup() {
    // form data
    const form = ref({
      taxiUserName: '',
      taxiUserPhoneNumber: '',
      taxiNumberOfPassenger: '',
      taxiPassengers: '',
      isTicketMessageWindow: false,
      selectedDeparturePlace: '',
      selectedArrivalPlace: '',
      selectedTicketNumber: 0,
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

    // validation rules
    const rules = {
      taxiUserPhoneNumber: { required },
      selectedDeparturePlace: { required },
      selectedArrivalPlace: { required },
      taxiNumberOfPassenger: { required },
    }
    const v$ = useVuelidate(rules, form.value)

    // プロフィール取得関数
    const getProfile = async () => {
      const profile = await liff.getProfile()
      form.value.taxiUserName = profile.displayName // LINEの名前
    }

    // 予約の関数
    const reserve = async () => {
      // バリデーション実行
      const isFormCorrect = await v$.value.$validate()
      if (!isFormCorrect) {
        console.log('バリデーションエラー')
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
        departurePlace: form.value.selectedDeparturePlace,
        arrivalPlace: form.value.selectedArrivalPlace,
        userPhoneNumber: form.value.taxiUserPhoneNumber,
        userNumberOfPassenger: Number(form.value.taxiNumberOfPassenger),
        userPassengers: form.value.taxiPassengers,
        numberOfTickets: Number(form.value.selectedTicketNumber),
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

    const getTicketNumber = () => {
      let idx1 = Number(form.value.selectedDeparturePlace)
      let idx2 = Number(form.value.selectedArrivalPlace)
      if (idx1 === 0 || idx2 === 0) {
        form.value.selectedTicketNumber = 0
        return
      }
      if (idx1 > 4 || idx2 > 4) {
        form.value.selectedTicketNumber = 0
        return
      }
      if (idx1 === idx2) {
        form.value.selectedTicketNumber = 0
        return
      }
      if (idx1 > idx2) {
        let tmpIdx = idx2
        idx2 = idx1
        idx1 = tmpIdx
      }
      form.value.selectedTicketNumber =
        tickets[(idx1 - 1) * 4 - (idx1 * (idx1 + 1)) / 2 + idx2 - 1].number
      form.value.isTicketMessageWindow = true
    }

    // ページを開いた時に実行
    onMounted(async () => {
      await liff.init({ liffId: import.meta.env.VITE_APP_LIFFID })
      if (liff.isLoggedIn()) {
        await getProfile()
      } else {
        liff.login()
      }
    })

    // return
    return {
      form,
      places,
      v$,
      reserve,
      getTicketNumber,
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
