import * as slack from '@slack/client';
import fetch from "node-fetch";

import * as url from "url";

class Message {
    type: string;
    user: string;
    text: string;
    client_msg_id: string;
    team: string;
    channel: string;
    event_ts: string;
    ts: string;
    bot_id?: string;
}

export class DittoBot {
    rtm: slack.RTMClient;

    constructor(token: string) {
        this.rtm = new slack.RTMClient(token);
    }

    run() {
        const rtm = this.rtm;

        rtm.addListener("message", res => {
            try {
                this.onMessage(res);
            } catch (err) {
                console.error(err);
            }
        });

        rtm.start();
        console.log("Bot start");
    }

    private onMessage(message: Message) {
        const botId = message.bot_id as string;

        // Do not respond on other bot's message
        if (botId !== undefined) {
            return;
        }

        const text = message.text;
        const channel = message.channel;

        if (text.startsWith("<") && text.endsWith(">")) {
            this.onLink(text.slice(0, text.length - 1).slice(1), channel);
        }
        else {
            // this.rtm.sendMessage(text, channel);
        }
    }

    private onLink(link: string, channel: string) {
        const linkObj = url.parse(link);
        console.log(linkObj);

        if (linkObj.host === "namu.wiki") {
            const titleRegex = /<title>(.+) - 나무위키<\/title>/;

            fetch(link)
                .then(res => res.text())
                .then(body => {
                    const match = body.match(titleRegex);
                    if (match !== null) {
                        const title = match[1];
                        this.rtm.sendMessage(title, channel);
                    }
                });
        }
    }
}