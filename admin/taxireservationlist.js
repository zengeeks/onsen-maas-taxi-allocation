const api_url = "ここにAzure Static Web Appsのエンドポイントを記載する";

const places = ["", "観光会館", "○○駅", "○○温泉", "○○カフェ"];
const reservation_status = ["", "受付", "手配中", "手配済み", "キャンセル済"];

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
* アクセスしてきたユーザーへのLINEメッセージの送信
* @param {string} userId		メッセージ送信するユーザーLINE ID
* @param {string} messageText	メッセージ本文（テキスト）
*/
function sendLINEPushMessage(userId, messageText) {
	if (userId.length === 0 || messageText.length === 0) return;
	const mess_body = new Object();
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
* 予約一覧取得処理
*/
function getTaxiReservationList() {
	const now = new Date();
	const fromDate = now.toISOString();
	const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
	let query = new URLSearchParams();
	query.append("fromDate", fromDate);
	query.append("toDate", toDate);
	const send_url = "/api/taxireservelist?" + query.toString();
	const request = new XMLHttpRequest();
	request.open("GET", send_url);
	request.setRequestHeader("Content-Type", "application/json");
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			const taxiReservationListObj = JSON.parse(request.responseText);
			let tableElement = "";
			const elem = document.getElementById("taxiReservationListTable");
			for (i = 0; i < taxiReservationListObj.length; i++) {
				if (taxiReservationListObj[i] !== null) {
					tableElement += "<tr><td>";
					tableElement += taxiReservationListObj[i].id;
					tableElement += "</td><td>";
					tableElement += getDateFormatedText(new Date(taxiReservationListObj[i].reservationDatetime), 'YYYY年MM月DD日 hh時mm分');
					tableElement += "</td><td>";
					tableElement += taxiReservationListObj[i].userName;
					tableElement += "</td><td>";
					tableElement += taxiReservationListObj[i].userPhoneNumber;
					tableElement += "</td><td>";
					tableElement += places[Number(taxiReservationListObj[i].departurePlace)];
					tableElement += "</td><td>";
					tableElement += places[Number(taxiReservationListObj[i].arrivalPlace)];
					tableElement += "</td><td>";
					tableElement += taxiReservationListObj[i].numberOfTickets;
					tableElement += "</td><td>";
					tableElement += taxiReservationListObj[i].userNumberOfPassenger;
					tableElement += "</td><td>";
					tableElement += reservation_status[Number(taxiReservationListObj[i].reservationStatus)];
					tableElement += "</td><td>";
					tableElement += "<button type=\"submit\" onclick=\"changeStatus(" + taxiReservationListObj[i].reservationId + ",\'" + taxiReservationListObj[i].userId + "\', 2)\">手配中</button>";
					tableElement += "<button type=\"submit\" onclick=\"changeStatus(" + taxiReservationListObj[i].reservationId + ",\'" + taxiReservationListObj[i].userId + "\', 3)\">手配済</button>";
					tableElement += "<button type=\"submit\" onclick=\"changeStatus(" + taxiReservationListObj[i].reservationId + ",\'" + taxiReservationListObj[i].userId + "\', 4)\">キャンセル</button>";
					tableElement += "</td><td>";
					tableElement += getDateFormatedText(new Date(taxiReservationListObj[i].latestUpdateDatetime), 'YYYY年MM月DD日 hh時mm分');
					tableElement += "</td></tr>";
				}
			}
			elem.innerHTML = tableElement;
		}
	};
	request.send();
}
/**
* ステータス変更
*/
function changeStatus(reservationId, userId, statusCd) {
	const date = new Date();
	const msg_body = new Object();
	msg_body.reservationId = reservationId;
	msg_body.reservationStatus = statusCd;
	const msg_json = JSON.stringify(msg_body);
	const send_url = api_url + "/api/taxichangestatus";
	const request = new XMLHttpRequest();
	request.open("POST", send_url);
	request.setRequestHeader("Content-Type", "application/json");
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			//正常
			getTaxiReservationList();
			if (statusCd === 3) {
				sendLINEPushMessage(userId, "タクシー配車を行いました。しばらくお待ちください.");
			}
			else if (statusCd === 4) {
				sendLINEPushMessage(userId, "申し訳ありません。タクシーを手配できませんでした。");
			}
		}
	};
	request.send(msg_json);
}
/**
* ページ読み込み時の処理
*/
function proc() {
	document.getElementById("MessageWindow").style.display = "none";
	getTaxiReservationList();
	setInterval(getTaxiReservationList, 10000);
}
