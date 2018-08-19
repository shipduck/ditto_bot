import url from 'url';

import {
	matchLinks,
} from './helpers';
import { LinkModule, DittoBotModule, RawMessageModule } from './modules/base';
import { NamuWikiModule } from './modules/namuwiki';
import { MonsterhunterImageModule } from './modules/monsterhunter_image';

export interface Message {
	user: string;
	text: string;
	channel: string;
	by_bot: boolean;
}

export interface SendLinkArguments {
	channel: string;
	text: string;
	link: string;
	color: string;
}

export interface Logger {
	log(msg: any): void;
	info(msg: any): void;
	error(msg: any): void;
}

export abstract class DittoBot {
	public logger: Logger;
	protected linkModules: LinkModule[] = [];
	protected rawMessageModules: RawMessageModule[] = [];

	public constructor() {
		this.addModule(new NamuWikiModule());
		this.addModule(new MonsterhunterImageModule());
	}

	public addModule(module: DittoBotModule) {
		if (LinkModule.isImplemented(module)) {
			this.linkModules.push(module);
		}
		if (RawMessageModule.isImplemented(module)) {
			this.rawMessageModules.push(module);
		}
	}

	protected async onMessage(message: Message) {
		// Do not respond on other bot's message
		if (message.by_bot) {
			return;
		}

		const text = message.text;
		const channel = message.channel;

		this.logger.info(message);

		if (text === undefined) {
			return;
		}

		const links = matchLinks(text);
		if (links.length > 0) {
			await Promise.all(links.map((link) => this.onLink(link, channel)));
		}
		else {
			await this.onRawMessage(text, channel);
		}
	}

	private async onLink(link: string, channel: string) {
		const linkObj = url.parse(link, true);

		return Promise.all(this.linkModules.map((module) => module.onLink(this, linkObj, channel)));
	}

	private onRawMessage(text: string, channel: string) {
		return Promise.all(this.rawMessageModules.map((module) => module.onRawMessage(this, text, channel)));
	}

	public abstract sendImage(imageLink: string, channel: string): void;
	public abstract sendLink(arg: SendLinkArguments): void;
}
