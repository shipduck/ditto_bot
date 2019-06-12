const characters = [
	'',
	'▌',
	'█',
];

export function generateBar(value: number): string {
	let n = Math.round(value / 500);
	let str = '';
	const step = 2;
	while(n >= step) {
		str += characters[step];
		n -= step;
	}
	str += characters[n];
	return str;
}
