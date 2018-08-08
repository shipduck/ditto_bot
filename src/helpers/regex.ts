const regexLink = /<[^>]+>/g;
const regexNamuWikiTitle = /<title>(.+) - 나무위키<\/title>/;

export function matchLinks(text: string): string[] {
	const match = text.match(regexLink);

	if(match === null) {
		return [];
	}

	return match.map((e) => {
		return e.substring(1, e.length - 1);
	}).filter((e) => {
		return e.startsWith('@') === false;
	}).map((e) => {
		return encodeURI(e);
	});
}

export function matchNamuWikiTitle(text: string): string {
	const match = text.match(regexNamuWikiTitle);

	if(match === null) {
		return null;
	}

	return decodeURIComponent(match.pop());
}
