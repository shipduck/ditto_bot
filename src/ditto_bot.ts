import url from 'url';

import slack from '@slack/client';
import fetch from 'node-fetch';

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

export class DittoBot {
	private readonly rtm: slack.RTMClient;
	private readonly web: slack.WebClient;

	private static linkRegex = /<[^>]+>/g;

	constructor(token: string) {
		this.rtm = new slack.RTMClient(token);
		this.web = new slack.WebClient(token);
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
		console.log('Bot start');
	}

	private onMessage(message: Message) {
		// Do not respond on other bot's message
		if(message.bot_id !== undefined) {
			return;
		}

		const text = message.text;
		const channel = message.channel;

		console.log(message);

		if(text === undefined) {
			return;
		}

		const linkMatch = text.match(DittoBot.linkRegex);

		if(linkMatch !== null) {
			linkMatch.forEach((preLink) => {
				this.onLink(preLink.slice(0, preLink.length - 1).slice(1), channel);
			});
		}
		else {
			this.onRawMessage(text, channel);
		}
	}

	private async onLink(link: string, channel: string) {
		const linkObj = url.parse(link);

		if(linkObj.host === 'namu.wiki') {
			const titleRegex = /<title>(.+) - 나무위키<\/title>/;

			const body = await fetch(encodeURI(link)).then((res) => {
				return res.text();
			});

			const match = body.match(titleRegex);

			if(match !== null) {
				const encodedTitle = match[1];
				const decodedTitle = decodeURIComponent(encodedTitle);
				this.sendMessage(`<https://namu.wiki/w/${encodedTitle}|${decodedTitle} - 나무위키>`, channel);
			}
		}
	}

	private checkText(text: string): string {
		const retList: string[] = [];

		if(this.keywordExists(text, ['ㄷㄷ', 'ㄷㄷ가마루', '도도가마루'])) {
			retList.push('https://poolc.slack.com/files/U0HJ454UA/FC2KEA249/image.png');
		}

		if(this.keywordExists(text, ['ㅊㅊ', '추천'])) {
			retList.push('https://files.slack.com/files-pri/T024R0JEB-FC2EN6MEC/image.png');
		}

		if(this.keywordExists(text, ['ㅈㄹ', '지랄'])) {
			retList.push('https://files.slack.com/files-pri/T024R0JEB-FC3ADCTFX/image.png');
		}

		if(this.keywordExists(text, ['ㄹㅇ'])) {
			retList.push('https://files.slack.com/files-pri/T024R0JEB-FC4FMUDF0/image.png');
		}

		if(this.keywordExists(text, ['오도가론'])) {
			retList.push('https://poolc.slack.com/messages/C024R0JEP/');
		}

		if(retList.length === 0) {
			return null;
		}
		else {
			const ret = retList[Math.floor(Math.random() * retList.length)];
			return ret;
		}
	}

	private onRawMessage(text: string, channel: string) {
		const outText = this.checkText(text);

		if(outText !== null && Math.random() < 0.1) {
			this.sendMessage(outText, channel);
		}
	}

	private keywordExists(text: string, keywords: string[]) {
		return keywords.some((keyword) => {
			return text.indexOf(keyword) !== -1;
		});
	}

	private sendMessage(text: string, channel: string) {
		this.web.chat.postMessage({
			'channel': channel,
			'text': text,
		});
	}
}
