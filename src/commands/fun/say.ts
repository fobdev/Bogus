import { Command } from "../../interfaces";
import { Response } from "../../models";
export const Say: Command = {
    name: ["say"],
    arguments: ["message"],
    description: "Make the bot send a message with something",
    run: async (prefix, client, message, args) => {
        const { channel } = message;

        if (args?.length === 0) return channel.send("Say what?");

        const content = args?.join(" ");

        await message.delete();
        return channel.send(`\u200B` + content);
    },
};
