<template>
	<div id="taxiReserveWindow" class="hidden">
		<div class="container" align="center">
			<h3>タクシー配車予約</h3>
			<div id="taxiReserveWindow" class="hidden">
				<div class="input-group mb-3">
					<span class="input-group-text" id="basic-addon1">　　名前</span>
					<input type="text" class="form-control" placeholder="" v-model="taxiUserName" aria-label="Username" aria-describedby="basic-addon1">
				</div>
				<div class="input-group mb-3">
					<span class="input-group-text" id="basic-addon1">電話番号</span>
					<input type="text" class="form-control" placeholder="" v-model="taxiUserPhoneNumber" aria-label="Phone Number" aria-describedby="basic-addon1">
				</div>
				<div class="col-md-5">
					<label class="form-label" for="departurePlace">乗車場所</label>
					<select class="form-select" name="departurePlace" v-model="selectedDeparturePlace" v-on:change="getTicketNumber">
						<option v-for="place in places" v-bind:value="place.id">
						{{ place.name }}
						</option>
					</select>
				</div>
				<div class="col-md-5">
					<label class="form-label" for="arrivalPlace">降車場所</label>
					<select class="form-select" name="arrivalPlace" v-model="selectedArrivalPlace" v-on:change="getTicketNumber">
						<option v-for="place in places" v-bind:value="place.id">
						{{ place.name }}
						</option>
					</select>
				</div>
				<div id="TicketMessageWindow" class="hidden" align="center">
					<span v-if="isTicketMessageWindow"><br>必要なチケット枚数 {{ selectedTicketNumber }}枚</span>
					<span v-if="!isTicketMessageWindow"><br><br></span>
				</div>
				<br>
				<div class="col-md-5">
					<label for="taxiDeparturePlace" class="form-label">乗車人数</label>
					<select class="form-select" v-model="taxiNumberOfPassenger" required>
						<option value="1" selected>1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
					</select>
				</div>
				<br>
				<div class="input-group mb-3">
					<span class="input-group-text" id="basic-addon1">　同乗者</span>
					<input type="text" class="form-control" placeholder="" v-model="taxiPassengers" aria-label="Passengers" aria-describedby="basic-addon1">
				</div>
				<br>
				<div class="input-group mb-3">
					<button class="w-100 btn btn-primary btn-lg" @click=Reservation>予　約</button>
				</div>
				<br>
			</div>
			<div id="MessageWindow" class="hidden" align="center">
				<p class="fw-normal"><div id="message"></div></p>
			</div>
			<footer class="my-5 pt-5 text-muted text-center text-small">
				<p class="mb-1">&copy; 2021 温泉MaaS</p>
				<ul class="list-inline">
					<li class="list-inline-item"><a href="#">プライバシーポリシー</a></li>
					<li class="list-inline-item"><a href="#">規約</a></li>
					<li class="list-inline-item"><a href="#">サポート</a></li>
				</ul>
			</footer>
		</div>
	</div>
</template>

<script>
import liff from '@line/liff'
import axios from 'axios'
export default {
	name: 'TaxiReserve',
	data () {
		return {
			displayName: '',
			userId: '',
			taxiUserName: '',
			taxiUserPhoneNumber: '',
			taxiNumberOfPassenger: '',
			taxiPassengers: '',
			isMessageWindow: false,
			isTicketMessageWindow: false,
			textMessageWindow: '',
			selectedDeparturePlace: '0',
			selectedArrivalPlace: '0',
			selectedTicketNumber: '',
			ticket: [
				{number: 1},
				{number: 2},
				{number: 3},
				{number: 4},
				{number: 5}, 
				{number: 6}
			],// 1->2, 1->3, 1->4, 2->3, 2->4, 3->4
			places: [
				{id: '0', name: '選択してください...'},
				{id: '1', name: '観光会館'},
				{id: '2', name: '○○駅'},
				{id: '3', name: '○○温泉'},
				{id: '4', name: '○○カフェ'},
				]
		}
	},
	//ページを開いた時に実行される
	mounted () {
		console.log('ライフサイクル:mounted');
		liff.init({
				liffId: process.env.VUE_APP_LIFFID
		})
		.then(() => {
			// start to use LIFF's api
			if (liff.isLoggedIn()) {
				this.getProfile();
			} else {
				liff.login();
			}
		})
		.catch((err) => {
			console.log('エラー：Liff IDを取得できません。' + err);
		});
	},
	methods: {
		//プロフィール取得関数
		getProfile: function(){
			let self = this;
			liff.getProfile().then(function(profile) {
				self.taxiUserName = profile.displayName; //LINEの名前
				self.userId = profile.userId; //LINEのID
				console.log('関数:getProfile taxiUserName:[' + profile.displayName + '] userId[' + profile.userId + ']');
			}).catch(function(error) {
				console.log('関数:getProfile エラー:[' + error + ']');
			});
		},

		//ログアウト処理の関数
		logout: function(){
			if (liff.isLoggedIn()){
				alert('ログアウトします。');
				liff.logout();
				window.location.reload();
			}
		},

		//予約の関数
		Reservation: function(){
			const date = new Date();
			const taxi_reserve_body  = new Object();
			taxi_reserve_body.userIdToken	= liff.getIDToken();
			taxi_reserve_body.userName		= this.taxiUserName;
			taxi_reserve_body.departurePlace	= this.selectedDeparturePlace;
			taxi_reserve_body.arrivalPlace		= this.selectedArrivalPlace;
			taxi_reserve_body.userPhoneNumber	= this.taxiUserPhoneNumber;
			taxi_reserve_body.userNumberOfPassenger	= Number(this.taxiNumberOfPassenger);
			taxi_reserve_body.userPassengers	= this.taxiPassengers;
			taxi_reserve_body.numberOfTickets	= Number(this.selectedTicketNumber);
			taxi_reserve_body.reservationDatetime	= date.toISOString();
			const json_taxireserve_mess = JSON.stringify(taxi_reserve_body);
			const url = '/api/taxireserve'
			// POST
			axios.post(url,json_taxireserve_mess)
			.then(response => {
					this.sendMessage('タクシー配車予約を受け付けました。');
					liff.closeWindow();
			})
			.catch(error => {
				console.log(error);
			});
		},
		
		getTicketNumber: function() {
			let idx1 = Number(this.selectedDeparturePlace);
			let idx2 = Number(this.selectedArrivalPlace);
			if(idx1 === 0 || idx2 === 0){ this.selectedTicketNumber = 0; return;}
			if(idx1 >   4 || idx2 >   4){ this.selectedTicketNumber = 0; return;}
			if(idx1 === idx2){ this.selectedTicketNumber = 0; return;}
			if(idx1 > idx2){
				let tmpIdx = idx2;
				idx2 = idx1;
				idx1 = tmpIdx;
			}
			this.selectedTicketNumber = this.ticket[(idx1-1)*4-idx1*(idx1+1)/2+idx2-1].number;
			this.isTicketMessageWindow = true;
		},

		//LINEにメッセージ送信の関数
		sendMessage: function(messageText){
			if(liff.isLoggedIn()) {
				const mess_body  = new Object();
				mess_body.userIdToken = liff.getIDToken();
				mess_body.messageText = messageText;
				const json_mess = JSON.stringify(mess_body);
				const url = '/api/sendmessage';
				// POST
				axios.post(url,json_mess)
				.then(response => {
						console.log(response);
				})
				.catch(error => {
					console.log(error);
				});
			}
		},
	},
}
</script>

<style>
</style>
