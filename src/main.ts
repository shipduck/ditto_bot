import {
	DittoBot, SendLinkArguments,
} from './ditto_bot';

import {
	RTMClient,
	WebClient,
} from '@slack/client';

const slackToken = process.env.token;

interface SlackMessage {
	type: string;
	user: string;
	text: string;
	client_msg_id: string;
	team: string;
	channel: string;
	event_ts: string;
	ts: string;
	bot_id?: string;
	message?: SlackMessage;
}

class DittoBotSlack extends DittoBot {
	private readonly rtm: RTMClient;
	private readonly web: WebClient;

	constructor(token: string) {
		super();

		this.logger = console;
		this.rtm = new RTMClient(token);
		this.web = new WebClient(token);
	}

	public run() {
		const rtm = this.rtm;

		rtm.addListener('message', (res: SlackMessage) => {
			try {
				this.onMessage({
					'user': res.user,
					'text': res.text,
					'channel': res.channel,
					'by_bot': res.bot_id !== undefined,
				});
			}
			catch (err) {
				console.error(err);
			}
		});

		rtm.start();
		console.log('bot start');
	}

	public sendImage(imageLink: string, channel: string) {
		this.rtm.sendMessage(imageLink, channel);
	}

	public sendLink(arg: SendLinkArguments) {
		this.web.chat.postMessage({
			'channel': arg.channel,
			'text': '',
			'unfurl_media': true,
			'unfurl_links': true,
			'attachments': [
				{
					'fallback': arg.text,
					'title': arg.text,
					'title_link': arg.link,
					// 'text': '요약',
					'color': `#${arg.color}`,
				},
			],
		});
	}
}

const ditto = new DittoBotSlack(slackToken);
ditto.run();
