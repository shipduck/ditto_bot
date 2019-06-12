import {
	DittoBot,
	SendLinkArguments,
	User,
} from './ditto_bot';

import {
	RTMClient,
	WebClient,
} from '@slack/client';

import {
	createLogger,
	format,
	transports,
} from 'winston';

const logger = createLogger({
	'level': __dev ? 'silly' : 'warn',
	'format': format.simple(),
	'transports': [
		new transports.Console(),
	],
});

if (__sentry_dsn) {
	const root = __dirname || process.cwd();

	Promise.all([import('path'), import('winston-raven-sentry')]).then(([path, sentryTransport]) => {
		logger.transports.push(new sentryTransport({
			'dsn': __sentry_dsn,
			'config': {
				'dataCallback'(data: any) {
					const stacktrace = data.exception && data.exception[0].stacktrace;

					if (stacktrace && stacktrace.frames) {
						stacktrace.frames.forEach((frame: any) => {
							if (frame.filename.startsWith('/')) {
								frame.filename = `app:///${path.relative(root, frame.filename)}`;
							}
						});
					}

					return data;
				},
			},
		}));
	});
}

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

		this.logger = logger;
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
					'actions': [
						{
							'type': 'button',
							'text': arg.text,
							'url': arg.link,
							'style': 'primary',
						},
					],
				},
			],
		});
	}

	public sendMessage(message: string, channel: string) {
		this.web.chat.postMessage({
			'channel': channel,
			'text': message,
		});
	}

	public sendBlocks(blocks: any[], channel: string) {
		this.web.chat.postMessage({
			'channel': channel,
			'text': 'fallback text',
			'blocks': blocks,
		});
	}

	public async fetchUsers() {
		const res = await this.web.users.list();
		return res.members as User[];
	}
}

const ditto = new DittoBotSlack(slackToken);
ditto.run();
