import { Client, Message } from "discord.js";
import { CommandList } from "../commands/_CommandList";

export const onMessage = async (client: Client, message: Message) => {
    const prefix = ">";

    let { content } = message;

    const args = content.split(" ").slice(1);

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    for (const Command of CommandList) {
        Command.name.forEach(async (element) => {
            const filterSingle = Command.name.filter(
                (val) => val === content.substring(prefix.length)
            )[0];

            if (element === filterSingle) return await Command.run(client, message, args);
        });
    }

    return console.log(`${message.author.tag} just said [${message.content}]`);
};
