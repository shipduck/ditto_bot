import * as slack from '@slack/client';

const web = new slack.WebClient(__env.token);
web.chat.postMessage({ channel: 'random', text: 'This is from @slack/client package' })
	.then(res => {
		console.log(res);
	})
	.catch(err => {
		console.error(err);
	});