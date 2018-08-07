import { DittoBot } from "./ditto_bot";

const token = __env.token;

const ditto = new DittoBot(token);
ditto.run();