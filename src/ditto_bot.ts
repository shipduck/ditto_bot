import * as slack from '@slack/client';

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

        try {
            rtm.addListener("message", res => {
                this.onMessage(res);
            });

            rtm.start();

            console.log("Bot start");
        } catch (err) {
            console.error(err);
        }
    }

    private onMessage(message: Message) {
        const botId = message.bot_id as string;

        // Do not respond on other bot's message
        if (botId !== undefined) {
            return;
        }

        this.rtm.sendMessage(message.text, message.channel);
    }
}