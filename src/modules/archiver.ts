import {
	DittoBot,
	RawMessageModule,
} from './base';

import {
	redis,
} from '../libs';

export class ArchiverModule implements RawMessageModule {
	private readonly key = 'ditto-archive';

	public async onRawMessage(bot: DittoBot, user: string, msg: string, channel: string) {
		if (msg.indexOf('<@UC3MU7MT7>') !== -1 && msg.indexOf('잉여') !== -1) {
			this.onCommand(bot, channel);
			return;
		}
		const score = Date.now();
		try {
			await redis.zadd(this.key, `${score}`, `${score}:${user}`);
		}
		catch (error) {
			console.log(error);
		}
	}

	public async onCommand(bot: DittoBot, channel: string) {
		try {
			const entries = await redis.zrangebyscore(this.key, '-inf', '+inf');
			const table: { [key: string]: number; } = {};
			for (const entry of entries) {
				const key = entry.split(':').pop();
				if (table[key] === undefined) {
					table[key] = 0;
				}
				++table[key];
			}
			const message = Object.keys(table).map((key) => {
				return {
					'user': key,
					'count': table[key],
				};
			}).sort((a, b) => b.count - a.count).slice(0, 5).map((e) => JSON.stringify(e)).join(' ');
			bot.sendMessage(message, channel);
		}
		catch (error) {
			console.log(error);
		}
	}
}
