import 'mocha';
import { assert } from 'chai';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { sendRequest, MethodType, ResultType } from '../../src/helpers';

describe('helpers', () => { describe('request', () => { describe('sendRequest', () => {
	const app = express();
	app.use(bodyParser.json());
	const server = http.createServer(app).listen();
	const address = server.address();
	if (typeof address === 'string') {
		return;
	}
	const port = address.port;
	const baseURL = `http://127.0.0.1:${port}`;
	app.set('port', port);
	app.get('/', (req, res) => {
		res.end('index', 'utf-8');
	});
	app.get('/not-found', (req, res) => {
		res.status(404);
		res.end();
	});
	app.get('/params', (req, res) => {
		const keys = Object.keys(req.query);
		res.end(keys.map((key) => `${key}=${req.query[key]}`).join('&'));
	});
	app.post('/append', (req, res) => {
		res.end(JSON.stringify(req.body) + '_some_data');
	});
	app.get('/json_basic', (req, res) => {
		res.contentType('applictaion/json');
		res.end(JSON.stringify(['data']));
	});
	app.post('/json_data', (req, res) => {
		const data = req.body;

		res.contentType('application/json');
		res.end(JSON.stringify([data]));
	});

	app.listen(server);
	after(() => {
		server.close();
	});

	it('sendRequest-get-text', async () => {
		const resp = await sendRequest(`${baseURL}/`, MethodType.GET, ResultType.TEXT);
		assert.equal(resp, 'index');
	});

	it('sendRequest-get-text-param', async () => {
		const resp = await sendRequest(`${baseURL}/params`, MethodType.GET, ResultType.TEXT, {'key': 'value'});
		assert.equal(resp, 'key=value');
	});

	it('sendRequest-get-text-404', async () => {
		try {
			await sendRequest(`${baseURL}/not-found`, MethodType.GET, ResultType.TEXT);
		} catch (e) {
			assert.fail('sendRequest does not rejected by 404');
		}
	});

	it('sendRequest-post-text', async () => {
		const resp = await sendRequest(`${baseURL}/append`, MethodType.POST, ResultType.TEXT, ['text']);
		assert.equal(resp, '["text"]_some_data');
	});

	it('sendRequest-get-json', async () => {
		const resp = await sendRequest(`${baseURL}/json_basic`, MethodType.GET, ResultType.JSON);
		assert.deepEqual(resp, ['data']);
	});

	it('sendRequest-post-json', async () => {
		const resp = await sendRequest(`${baseURL}/json_data`, MethodType.POST, ResultType.JSON, ['hello']);
		assert.deepEqual(resp, [['hello']]);
	});
}); }); });
