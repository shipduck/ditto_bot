import {
	DittoBot,
	RawMessageModule,
} from './base';

import {
	redis,
} from '../libs';

import {
	generateBar,
} from '../helpers';

export class ArchiverModule implements RawMessageModule {
	private readonly key = 'ditto-archive';

	private readonly users: {
		[key: string]: string;
	} = {};

	public async onRawMessage(bot: DittoBot, user: string, msg: string, channel: string) {
		if (msg.indexOf('<@UC3MU7MT7>') !== -1 && msg.indexOf('잉여') !== -1) {
			const showAll = msg.indexOf('all') !== -1;
			await this.onCommand(bot, channel, showAll);
			return;
		}
	}

	public async onCommand(bot: DittoBot, channel: string, showAll: boolean = false) {
		try {

			const zrangeBegin = new Date();
			const entries = await redis.zrange(this.key, 0, -1);
			const zrangeEnd = new Date();

			console.log('Zrange time: ', (zrangeEnd.getTime() - zrangeBegin.getTime()) / 1000 , ' seconds');

			const sortBegin = new Date();

			const table: { [key: string]: number; } = {};
			for (const entry of entries) {
				const key = entry.split(':').pop();
				if (table[key] === undefined) {
					table[key] = 0;
				}
				++table[key];
			}
			let x = Object.keys(table).map((key) => {
				return {
					'user': key,
					'count': table[key],
				};
			}).sort((a, b) => b.count - a.count);

			const sortEnd = new Date();

			console.log('Sort time: ', (sortEnd.getTime() - sortBegin.getTime()) / 1000, ' seconds');

			if (!showAll) {
				x = x.slice(0, 5);
			}

			const fetchBegin = new Date();

			if (x.some((e) => !this.users[e.user])) {
				const users = await bot.fetchUsers();
				for (const user of users) {
					this.users[user.id] = user.name;
				}
			}

			const fetchEnd = new Date();

			console.log('Fetch time: ', (fetchEnd.getTime() - fetchBegin.getTime()) / 1000, ' seconds');

			const blocks = [
				{
					'type': 'section',
					'text': {
						'type': 'mrkdwn',
						'text': x.map((e) => {
							return `*${this.users[e.user]}:*\n\t${generateBar(e.count)} ${e.count}`;
						}).join('\n'),
					},
				},
			];
			bot.sendBlocks(blocks, channel);
		}
		catch (error) {
			console.log(error);
		}
	}
}
