import 'mocha';
import { assert } from 'chai';
import { matchLinks, matchNamuWikiTitle } from '../../src/helpers';

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

	describe('matchNamuWikiTitle', () => {
		it('not matched', () => {
			assert.isNull(matchNamuWikiTitle('<title></title>'));
			assert.isNull(matchNamuWikiTitle(''));
			assert.isNull(matchNamuWikiTitle('some plain text'));
		});

		it('matched', () => {
			assert.equal(matchNamuWikiTitle('<title>afjie - 나무위키</title>'), 'afjie');
			assert.equal(matchNamuWikiTitle('<title>%20 - 나무위키</title>'), ' ');
		});
	});
}); });
