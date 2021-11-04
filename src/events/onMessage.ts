import { Client, Message } from "discord.js";
import { CommandList } from "../commands/_CommandList";
import botconfig from "../botconfig.json";
import { Player } from "discord-player";

export const onMessage = async (client: Client, player: Player, message: Message) => {
    const prefix = botconfig.prefix;

    let { content } = message;

    const args = content.split(" ").slice(1);

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    for (const Command of CommandList) {
        Command.name.forEach(async (element) => {
            const filterSingle = Command.name.filter(
                (val) => val === content.split(" ")[0].substring(prefix.length)
            );

            if (element === filterSingle[0])
                return await Command.run(client, message, args, player);
        });
    }

    return console.log(`${message.author.tag} just said [${message.content}]`);
};
