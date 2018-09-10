import { DittoBot, UrlWithParsedQuery, LinkModule } from './base';
import { sendRequest, MethodType, ResultType, matchNamuWikiTitle } from '../helpers';

export class NamuWikiModule implements LinkModule {
	public async onLink(bot: DittoBot, link: UrlWithParsedQuery, channel: string): Promise<void> {
		if (link.host === 'namu.wiki') {
			try {
				const res = await sendRequest(link.href, MethodType.GET, ResultType.TEXT);

				const title = matchNamuWikiTitle(res);

				if (title === null) {
					return;
				}

				bot.sendLink({
					'text': `${title} - 나무위키`,
					'link': link.href,
					'channel': channel,
				});
			}
			catch (err) {
				bot.logger.error(err);
			}
		}
	}
}
