import * as slack from '@slack/client';

const token = __env.token;

const rtm = new slack.RTMClient(token);

async function run() {
	try {
		rtm.addListener("message", res => {
			const botId = res.bot_id as string;
			const channelId = res.channel as string;
			const text = res.text as string;

			// Do not respond on other bot's message
			if(botId !== undefined) {
				return;
			}

			rtm.sendMessage(text, channelId);
		});

		rtm.start();

		console.log("Bot start");
	} catch (err) {
		console.error(err);
	}
}

run();