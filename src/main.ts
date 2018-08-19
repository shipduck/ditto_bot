import {
	DittoBot, SendLinkArguments,
} from './ditto_bot';

import {
	RTMClient,
	WebClient,
} from '@slack/client';

const slackToken = process.env.token;

class DittoBotSlack extends DittoBot {
	private readonly rtm: RTMClient;
	private readonly web: WebClient;

	constructor(token: string) {
		super();

		this.rtm = new RTMClient(token);
		this.web = new WebClient(token);
	}

	public run() {
		const rtm = this.rtm;

		rtm.addListener('message', (res) => {
			try {
				this.onMessage(res);
			}
			catch (err) {
				console.error(err);
			}
		});

		rtm.start();
		console.log('bot start');
	}

	protected sendImage(imageLink: string, channel: string) {
		this.rtm.sendMessage(imageLink, channel);
	}

	protected sendLink(arg: SendLinkArguments) {
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
