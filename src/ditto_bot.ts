import url from 'url';

import {
	RTMClient,
	WebClient,
} from '@slack/client';

import {
	sendRequest,
	MethodType,
	ResultType,
	matchLinks,
	matchNamuWikiTitle,
} from './helpers';

interface Message {
	type: string;
	user: string;
	text: string;
	client_msg_id: string;
	team: string;
	channel: string;
	event_ts: string;
	ts: string;
	bot_id?: string;
	message?: Message;
}

interface SendLinkArguments {
	channel: string;
	text: string;
	link: string;
	color: string;
}

export class DittoBot {
	private readonly rtm: RTMClient;
	private readonly web: WebClient;

	constructor(token: string) {
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

	private onMessage(message: Message) {
		// Do not respond on other bot's message
		if (message.bot_id !== undefined) {
			return;
		}

		const text = message.text;
		const channel = message.channel;

		if (__dev) {
			console.log(message);
		}

		if (text === undefined) {
			return;
		}

		const links = matchLinks(text);
		if (links.length > 0) {
			links.forEach((link) => {
				this.onLink(link, channel);
			});
		}
		else {
			this.onRawMessage(text, channel);
		}
	}

	private async onLink(link: string, channel: string) {
		const linkObj = url.parse(link);

		if (linkObj.host === 'namu.wiki') {
			try {
				const res = await sendRequest(link, MethodType.GET, ResultType.TEXT);

				const title = matchNamuWikiTitle(res);

				if (title === null) {
					return;
				}

				this.sendLink({
					'text': `${title} - 나무위키`,
					'link': link,
					'channel': channel,
					'color': '00A495',
				});
			}
			catch (err) {
				console.log(err);
			}
		}
	}

	private getImage(text: string) {
		const retList: Array<[string, string]> = [];

		if (this.keywordExists(text, ['ㄷㄷ', 'ㄷㄷ가마루', '도도가마루'])) {
			retList.push(['도도가마루', 'https://poolc.slack.com/files/U0HJ454UA/FC2KEA249/image.png']);
		}

		if (this.keywordExists(text, ['ㅊㅊ', '추천'])) {
			retList.push(['치치야크', 'https://files.slack.com/files-pri/T024R0JEB-FC2EN6MEC/image.png']);
		}

		if (this.keywordExists(text, ['ㅈㄹ', '지랄'])) {
			retList.push(['조라마그다라오스', 'https://files.slack.com/files-pri/T024R0JEB-FC3ADCTFX/image.png']);
		}

		if (this.keywordExists(text, ['ㄹㅇ'])) {
			retList.push(['로아루드로스', 'https://files.slack.com/files-pri/T024R0JEB-FC4FMUDF0/image.png']);
		}

		if (this.keywordExists(text, ['오도가론'])) {
			retList.push(['오도가론', 'https://poolc.slack.com/messages/C024R0JEP/']);
		}

		if (retList.length === 0) {
			return [null, null];
		}
		else {
			const ret = retList[Math.floor(Math.random() * retList.length)];
			return ret;
		}
	}

	private onRawMessage(text: string, channel: string) {
		const [outText, imageLink] = this.getImage(text);

		const prob = __dev ? 1 : 0.1;

		if (outText !== null && Math.random() < prob) {
			this.sendImage(outText, imageLink, channel);
		}
	}

	private keywordExists(text: string, keywords: string[]) {
		return keywords.some((keyword) => {
			return text.indexOf(keyword) !== -1;
		});
	}

	private sendImage(outText: string, imageLink: string, channel: string) {
		this.web.chat.postMessage({
			'channel': channel,
			'text': outText,
			'unfurl_media': true,
			'unfurl_links': true,
			'attachments': [
				{
					'fallback': 'Image',
					'image_url': imageLink,
				},
			],
		});
	}

	private sendLink(arg: SendLinkArguments) {
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
