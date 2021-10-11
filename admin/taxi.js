const defaultLiffId = "ここにLIFF IDを記載する";
const api_url = "ここにAzure Static Web Appsのエンドポイントを記載する";

const ticket = [ 1, 2, 3, 4, 5, 6 ]; // 1->2, 1->3, 1->4, 2->3, 2->4, 3->4
const places = ["", "観光会館","○○駅","○○温泉","○○カフェ"];
/**
* Get number of ticket
* @param {string} departurePlace
* @param {string} arrivalPlace
*/
function getNumberOfTicket(departurePlace, arrivalPlace){
	let idx1 = Number(departurePlace);
	let idx2 = Number(arrivalPlace);
	if(idx1 === 0 || idx2 === 0) return 0;
	if(idx1 >   4 || idx2 >   4) return 0;
	if(idx1 === idx2) return 0;
	if(idx1 > idx2){
		let tmpIdx = idx2;
		idx2 = idx1;
		idx1 = tmpIdx;
	}
	
	return ticket[(idx1-1)*4-idx1*(idx1+1)/2+idx2-1];
}
/**
* アクセスしてきたユーザーへのLINEメッセージの送信
*/
function sendLINEPushMessage(userId, messageText){
	const mess_body  = new Object();
		mess_body.messageType = "text";
		mess_body.messageSendType = "push";
		mess_body.userId = userId;
		mess_body.messageText = messageText;
	const json_mess = JSON.stringify(mess_body);
	const send_url = api_url + "/api/sendmessage";
	const request = new XMLHttpRequest();
		request.open("POST", send_url);
		request.setRequestHeader("Content-Type", "application/json");
		request.send(json_mess);
}
/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
	liff
		.init({
			liffId: myLiffId
		})
		.then(() => {
			// start to use LIFF's api
			if (liff.isLoggedIn()) {
				getProfileData();
			} else {
				document.getElementById("message").innerText = "エラー：LINEログインできません。";
				document.getElementById("MessageWindow").style.display ="block";
			}
		})
		.catch((err) => {
			document.getElementById("message").innerText = "エラー：Liff IDを取得できません。";
			document.getElementById("MessageWindow").style.display ="block";
		});
}
/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
	if (!myLiffId) {
		document.getElementById("message").innerText = "エラー：myLiffIdが指定されていません。";
		document.getElementById("MessageWindow").style.display ="block";
	} else {
		initializeLiff(myLiffId);
	}
}
/**
* アクセスしてきたユーザーのLINEプロフィールの取得
*/
function getProfileData(){
	liff.getProfile().then(function(profile) {
			document.getElementById("taxiUserName").value = profile.displayName;
	}).catch(function(error) {
		document.getElementById("message").innerText = "エラー：PROFILEを取得できません。";
		document.getElementById("MessageWindow").style.display ="block";
	});
}
/**
* アクセスしてきたユーザーへのLINEメッセージの送信
* @param {string} userId		メッセージ送信するユーザーLINE ID
* @param {string} messageText	メッセージ本文（FLEX Message JSON）
*/
function sendLINEPushMessage(userId, messageText){
	const mess_body  = new Object();
		mess_body.messageType = "text";
		mess_body.messageSendType = "push";
		mess_body.userId = userId;
		mess_body.messageText = messageText;
	const json_mess = JSON.stringify(mess_body);
	const send_url = api_url + "/api/sendmessage";
	const request = new XMLHttpRequest();
		request.open("POST", send_url);
		request.setRequestHeader("Content-Type", "application/json");
		request.send(json_mess);
}
/**
* 日時の書式文字列を返す
*/
function getDateFormatedText(date, format) {
	format = format.replace(/YYYY/, date.getFullYear());
	format = format.replace(/MM/, date.getMonth() + 1);
	format = format.replace(/DD/, date.getDate());
	format = format.replace(/hh/, date.getHours());
	format = format.replace(/mm/, date.getMinutes());
	return format;
}
/**
* 予約処理
*/
function taxi_reserve(){
	liff.getProfile().then(function(profile) {
		const departurePlace = document.getElementById("taxiDeparturePlace").value;
		const arrivalPlace = document.getElementById("taxiArrivalPlace").value;
		const date = new Date();
		const taxi_reserve_body  = new Object();
		taxi_reserve_body.userIdToken	= liff.getIDToken();
		taxi_reserve_body.userName		= document.getElementById("taxiUserName").value;
		taxi_reserve_body.departurePlace	= departurePlace;
		taxi_reserve_body.arrivalPlace		= arrivalPlace;
		taxi_reserve_body.userPhoneNumber	= document.getElementById("taxiUserPhoneNumber").value;
		taxi_reserve_body.userNumberOfPassenger	= Number(document.getElementById("taxiNumberOfPassenger").value);
		taxi_reserve_body.userPassengers	= document.getElementById("taxiPassengers").value;
		taxi_reserve_body.numberOfTickets	= Number(getNumberOfTicket(departurePlace, arrivalPlace));
		taxi_reserve_body.reservationDatetime	= date.toISOString();
		const json_taxireserve_mess = JSON.stringify(taxi_reserve_body);
		const send_url = api_url + "/api/taxireserve";
		const request = new XMLHttpRequest();
			request.open("POST", send_url);
			request.setRequestHeader("Content-Type", "application/json");
			request.onreadystatechange = function(){
				if (request.readyState === 4 && request.status === 200){
					sendLINEPushMessage(profile.userId, "タクシー配車予約を受け付けました。");
					liff.closeWindow();
				}
			};
			request.send(json_taxireserve_mess);
	}).catch(function(error) {
		document.getElementById("message").innerText = "エラー：PROFILEを取得できません。" + error;
		document.getElementById("MessageWindow").style.display ="block";
	});
}
/**
* 降車場所選択時の挙動
*/
function setTicketMessage(){
	const departurePlace = document.getElementById("taxiDeparturePlace").value;
	const arrivePlace = document.getElementById("taxiArrivalPlace").value;
	document.getElementById("ticketMessage").innerText = "必要なチケット枚数：" + String(getNumberOfTicket(departurePlace, arrivePlace)) + "枚";
	document.getElementById("TicketMessageWindow").style.display ="block";
}
/**
* セレクトボックスのoption設定
*/
function setSelectBoxOptions(){
	for(i=1; i<=4; i++){
		document.getElementById("taxiDeparturePlace").options[i].text = places[i];
		document.getElementById("taxiDeparturePlace").options[i].value = i;
		document.getElementById("taxiArrivalPlace").options[i].text = places[i];
		document.getElementById("taxiArrivalPlace").options[i].value = i;
	}
}
/**
* ページ読み込み時の処理
*/
function proc() {
	document.getElementById("TicketMessageWindow").style.display ="none";
	document.getElementById("MessageWindow").style.display ="none";
	setSelectBoxOptions();
	let myLiffId = "";
	myLiffId = defaultLiffId;
	initializeLiffOrDie(myLiffId);
}