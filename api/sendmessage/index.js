const http = require('https');
module.exports = function (context, req) {
	const userIdToken = req.body.userIdToken;
	let mess_array = [];
	let mess_body = new Object();
	let obj_mess = new Object();
	mess_body.text = req.body.messageText;
	mess_body.type = "text";
	mess_array.push(mess_body);
	obj_mess.messages = mess_array;
	
	const json_mess = "";
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(json_mess)
		}
	};
	const send_url = "https://api.line.me/oauth2/v2.1/verify?id_token=" + userIdToken + "&client_id=" + process.env.LIFF_CHANNEL_ID;
	const client = http.request(send_url, options, (res) => {
		let resBody = '';
		res.on('data', (chunk) => { resBody += chunk; });
		res.on('end', () => {
					const resObj = JSON.parse(resBody);
					if(resObj.sub === null) throw "Error : LINE ID token verify";
					obj_mess.to = resObj.sub;
					const json_mess = JSON.stringify(obj_mess);
					const auth_token = "Bearer " + process.env.LIFF_MSG_AUTH_TOKEN;
					const send_message_url = "https://api.line.me/v2/bot/message/push";
					const options = {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': auth_token,
							'Content-Length': Buffer.byteLength(json_mess)
						}
					};
					const client = http.request(send_message_url, options, (res) => {
						context.log(res.statusCode);
						context.log(res.headers);
						let resBody = '';
						res.on('data', (chunk) => { resBody += chunk; });
						res.on('end', () => {
							context.log(resBody);
							context.res = {
										status: 200,
										body: json_mess + resBody
							};
							context.done();
						});
					});
					client.on('error', (e) => {
							context.log.error(e);
							context.res = {
										status: 500,
										body: json_mess + e.stack
							};
							context.done();
					});
					client.write(json_mess);
					client.end();
		});
	});
	client.on('error', (e) => {
			context.res = {
						status: 500,
						body: resBody + e.stack
			};
			context.done();
	});
	client.write(json_mess);
	client.end();
};