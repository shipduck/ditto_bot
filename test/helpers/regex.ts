import 'mocha';
import { assert } from 'chai';
import { matchLinks } from '../../src/helpers';

describe('helpers', () => { describe('regex', () => {
	describe('matchLinks', () => {
		it('not matched', () => {
			assert.isEmpty(matchLinks(''));
			assert.isEmpty(matchLinks('hello, world!'));
			assert.isEmpty(matchLinks('>>> hi'));
			assert.isEmpty(matchLinks('<=-_-'));
			assert.isEmpty(matchLinks('<@U23344>'), 'mention tag should not be matched');
		});

		it('matched', () => {
			assert.deepEqual(matchLinks('<https://google.com>'), ['https://google.com']);
			assert.deepEqual(matchLinks('<https://twitter.com> <@U1293D>'), ['https://twitter.com']);
		});
	});
}); });
