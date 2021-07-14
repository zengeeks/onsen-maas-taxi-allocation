const http = require('https');
module.exports = function (context, req) {
	let mess_array = [];
	let mess_body = new Object();
	let obj_mess = new Object();
	if(req.body.messageType === "flex"){
		mess_body.contents = req.body.messageText;
		mess_body.altText = req.body.altText;
		mess_body.type = "flex";
		mess_array.push(mess_body);
		obj_mess.messages = mess_array;
	}
	else{
		mess_body.text = req.body.messageText;
		mess_body.type = "text";
		mess_array.push(mess_body);
		obj_mess.messages = mess_array;
	}
	
	let send_url = "";
	if(req.body.messageSendType === "push"){
		send_url = "https://api.line.me/v2/bot/message/push";
		obj_mess.to = req.body.userId;
	}
	else if(req.body.messageSendType === "broadcast"){
		send_url = "https://api.line.me/v2/bot/message/broadcast";
	}
	else{
		send_url = "https://api.line.me/v2/bot/message/push";
		obj_mess.to = req.body.userId;
	}
	
	const json_mess = JSON.stringify(obj_mess);
	
	const auth_token = "Bearer " + process.env.LIFF_MSG_AUTH_TOKEN;
	
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': auth_token,
			'Content-Length': Buffer.byteLength(json_mess)
		}
	};

	const client = http.request(send_url, options, (res) => {
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
};