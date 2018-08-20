import { UrlWithParsedQuery } from 'url';
import { DittoBot } from '../ditto_bot';

export interface LinkModule {
	onLink(bot: DittoBot, link: UrlWithParsedQuery, channel: string): Promise<void>;
}
export namespace LinkModule {
	export function isImplemented(module: DittoBotModule): module is LinkModule {
		return (module as LinkModule).onLink !== undefined;
	}
}

export interface RawMessageModule {
	onRawMessage(bot: DittoBot, text: string, channel: string): Promise<void>;
}
export namespace RawMessageModule {
	export function isImplemented(module: DittoBotModule): module is RawMessageModule {
		return (module as RawMessageModule).onRawMessage !== undefined;
	}
}

export type DittoBotModule = LinkModule | RawMessageModule;

export { UrlWithParsedQuery, DittoBot };
