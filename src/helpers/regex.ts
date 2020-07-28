const regexLink = /<[^>]+>/g;

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
		return encodeURI(decodeURI(e));
	});
}
