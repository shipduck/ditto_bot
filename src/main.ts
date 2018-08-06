import fetch from 'node-fetch';

fetch('https://slack.com/api/chat.postMessage', {
	'method': 'POST',
	'headers': {
		'Authorization': `Bearer ${__env.token}`,
		'Content-Type': 'application/json;charset=utf-8',
	},
	'body': JSON.stringify({
		'text': 'test',
		'channel': '#random',
	}),
}).then((res) => {
	return res.json();
}).then((res) => {
	console.log(res);
}).catch((err) => {
	console.log(err);
});
