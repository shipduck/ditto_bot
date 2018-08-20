import { RawMessageModule, DittoBot } from './base';

interface KeywordsMap {
	keywords: string[];
	text: string;
	image: string;
}

const keywordsMap: KeywordsMap[] = [{
	'keywords': ['ㄷㄷ', 'ㄷㄷ가마루', '도도가마루'],
	'text': '도도가마루',
	'image': 'https://poolc.slack.com/files/U0HJ454UA/FC2KEA249/image.png',
}, {
	'keywords': ['ㅊㅊ', '추천'],
	'text': '치치야크',
	'image': 'https://files.slack.com/files-pri/T024R0JEB-FC2EN6MEC/image.png',
}, {
	'keywords': ['ㅈㄹ', '지랄'],
	'text': '조라마그다라오스',
	'image': 'https://files.slack.com/files-pri/T024R0JEB-FC3ADCTFX/image.png',
}, {
	'keywords': ['ㄹㅇ'],
	'text': '로아루드로스',
	'image': 'https://files.slack.com/files-pri/T024R0JEB-FC4FMUDF0/image.png',
}, {
	'keywords': ['오도가론'],
	'text': '오도가론',
	'image': 'https://poolc.slack.com/messages/C024R0JEP/',
}];

export class MonsterhunterImageModule implements RawMessageModule {
	public async onRawMessage(bot: DittoBot, msg: string, channel: string) {
		const matched = this.getImage(msg);

		const prob = __dev ? 1 : 0.1;

		if (matched !== null && Math.random() < prob) {
			bot.sendImage(matched.image, channel);
		}
	}

	private getImage(text: string) {
		const retList: KeywordsMap[] = [];

		for (const item of keywordsMap) {
			if (this.keywordExists(text, item.keywords)) {
				retList.push(item);
			}
		}

		if (retList.length === 0) {
			return null;
		}
		else {
			const ret = retList[Math.floor(Math.random() * retList.length)];
			return ret;
		}
	}

	private keywordExists(text: string, keywords: string[]) {
		return keywords.some((keyword) => {
			return text.indexOf(keyword) !== -1;
		});
	}
}
