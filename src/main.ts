import {
	DittoBot,
} from './ditto_bot';

const token = process.env.token;

const ditto = new DittoBot(token);
ditto.run();
