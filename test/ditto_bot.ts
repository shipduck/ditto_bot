import 'mocha';
import { assert } from 'chai';

(global as any).__dev = true;

import { DittoBot, SendLinkArguments, Message } from '../src/ditto_bot';

type SendData = {
	'type': 'image',
	'link': string,
	'channel': string,
} | {
	'type': 'link',
	'data': SendLinkArguments,
};

describe('ditto_bot', () => {
	class TestDittoBot extends DittoBot {
		protected sendQueue: SendData[] = [];
		protected errors: Error[] = [];

		constructor() {
			super();

			this.logger = {
				'log'(msg: any) {
					// do nothing
				},
				'info'(msg: any) {
					// do nothing
				},
				'error': (e: Error) => {
					this.errors.push(e);
				},
			};
		}

		public receiveMessage(message: Message) {
			return this.onMessage(message);
		}

		public sendImage(imageLink: string, channel: string): void {
			this.sendQueue.push({
				'type': 'image',
				'link': imageLink,
				'channel': channel,
			});
		}

		public sendLink(arg: SendLinkArguments): void {
			this.sendQueue.push({
				'type': 'link',
				'data': arg,
			});
		}

		public flushQueue() {
			return this.sendQueue.splice(0, this.sendQueue.length);
		}

		public flushErrors() {
			return this.errors.splice(0, this.errors.length);
		}
	}

	it('normal message', async () => {
		const bot = new TestDittoBot();

		await bot.receiveMessage({
			'channel': '',
			'user': '',
			'text': 'normal text',
			'by_bot': false,
		});
		assert.deepEqual(bot.flushQueue(), []);
	});

	it('namuwiki link message', async () => {
		const bot = new TestDittoBot();

		await bot.receiveMessage({
			'channel': '',
			'user': '',
			'text': '<https://namu.wiki/w/ejfie> hello',
			'by_bot': false,
		});
		assert.deepEqual(bot.flushQueue(), [{
			'type': 'link',
			'data': {
				'channel': '',
				'text': 'ejfie - 나무위키',
				'link': 'https://namu.wiki/w/ejfie',
			},
		}]);
		assert.isEmpty(bot.flushErrors());
	});

	it('image', async () => {
		const bot = new TestDittoBot();

		await bot.receiveMessage({
			'channel': '',
			'user': '',
			'text': 'ㄷㄷ',
			'by_bot': false,
		});

		assert.isEmpty(bot.flushErrors());
		const message = bot.flushQueue();
		assert.equal(message.length, 1);
		assert.equal(message[0].type, 'image');
	});
});
