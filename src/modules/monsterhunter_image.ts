import { RawMessageModule, DittoBot } from './base';

interface KeywordsMap {
	keywords: string[];
	text: string;
	image: string;
}

const keywordsMap: KeywordsMap[] = [{
	'keywords': ['ㄷㄷ', 'ㄷㄷ가마루', '도도가마루'],
	'text': '도도가마루',
	'image': 'https://github.com/shipduck/ditto_bot/blob/master/images/Dodogama.png',
}, {
	'keywords': ['ㅊㅊ', '추천'],
	'text': '치치야크',
	'image': 'https://github.com/shipduck/ditto_bot/blob/master/images/Tzitzi_Ya_Ku.png',
}, {
	'keywords': ['ㅈㄹ', '지랄'],
	'text': '조라마그다라오스',
	'image': 'https://github.com/shipduck/ditto_bot/blob/master/images/Zorah_Magdaros.png',
}, {
	'keywords': ['ㄹㅇ', '리얼'],
	'text': '로아루드로스',
	'image': 'https://github.com/shipduck/ditto_bot/blob/master/images/Royal_Ludroth.png',
}, {
	'keywords': ['ㅇㄷ'],
	'text': '오도가론',
	'image': 'https://github.com/shipduck/ditto_bot/blob/master/images/Odogaron.png',
}, {
	'keywords': ['이불', '졸려', '잘래', '잠와', '이블조'],
	'text': '이블조',
	'image': 'https://github.com/shipduck/ditto_bot/blob/master/images/Evil_Jaw.png',
}];

export class MonsterhunterImageModule implements RawMessageModule {
	public async onRawMessage(bot: DittoBot, user: string, msg: string, channel: string) {
		const matched = this.getImage(msg);

		const prob = __dev ? 1 : 0.35;

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
