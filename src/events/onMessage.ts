import { Client, Message } from "discord.js";
import { CommandList } from "../commands/_CommandList";

export const onMessage = async (client: Client, message: Message) => {
    const prefix = ">";
    const args = message.content.split(" ").slice(1);

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    for (const Command of CommandList)
        if (message.content.startsWith(Command.name, prefix.length))
            await Command.run(client, message, args);

    return console.log(`${message.author.tag} just said [${message.content}]`);
};
