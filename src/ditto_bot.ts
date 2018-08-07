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
    message?: Message;
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

        console.log(message);

        if (text === undefined) {
            return;
        }

        const linkRegex = /<[^>]+>/g;
        const linkMatch = text.match(linkRegex);

        if (linkMatch !== null) {
            linkMatch.forEach(preLink => {
                this.onLink(preLink.slice(0, preLink.length - 1).slice(1), channel);
            })
        }
        else {
            this.onRawMessage(text, channel);
        }
    }

    private async onLink(link: string, channel: string) {
        const linkObj = url.parse(link);

        if (linkObj.host === "namu.wiki") {
            const titleRegex = /<title>(.+) - 나무위키<\/title>/;

            const body = await fetch(encodeURI(link)).then(res => res.text());

            const match = body.match(titleRegex);

            if (match !== null) {
                const title = decodeURIComponent(match[1]);
                this.sendMessage(title, channel);
            }
        }
    }

    private onRawMessage(text: string, channel: string) {
        let outText = "";
        let prob = 0;

        [outText, prob] = ((): [string, number] => {
            const retList = [] as string[];

            if (this.keywordExists(text, ["ㄷㄷ", "ㄷㄷ가마루", "도도가마루"])) {
                retList.push("https://poolc.slack.com/files/U0HJ454UA/FC2KEA249/image.png");
            }

            if (this.keywordExists(text, ["ㅊㅊ", "추천"])) {
                retList.push("https://files.slack.com/files-pri/T024R0JEB-FC2EN6MEC/image.png");
            }

            if (this.keywordExists(text, ["ㅈㄹ", "지랄"])) {
                retList.push("https://files.slack.com/files-pri/T024R0JEB-FC3ADCTFX/image.png");
            }

            if (this.keywordExists(text, ["ㄹㅇ"])) {
                retList.push("https://files.slack.com/files-pri/T024R0JEB-FC4FMUDF0/image.png");
            }

            if (this.keywordExists(text, ["오도가론"])) {
                retList.push("https://poolc.slack.com/messages/C024R0JEP/");
            }

            if (retList.length === 0) {
                return ["", 0];
            }
            else {
                const ret = retList[Math.floor(Math.random() * retList.length)];
                return [ret, 0.1];
            }
        })();

        const sendSuccess = Math.random() < prob;

        if (sendSuccess) {
            this.sendMessage(outText, channel);
        }
    }

    private keywordExists(text: string, keywords: string[]) {
        return keywords.some(keyword => text.indexOf(keyword) !== -1);
    }

    private sendMessage(text: string, channel: string) {
        this.rtm.sendMessage(text, channel);
    }
}