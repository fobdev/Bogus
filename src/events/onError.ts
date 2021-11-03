import { Message } from "discord.js";
import { Response } from "../models";

export const onError = (message: Message, error: any) => {
    return message.channel.send({
        embeds: [Response("Bot Related Error", `Error: ${error.message}`, "FAIL")],
    });
};
