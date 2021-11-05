import { Client, Message } from "discord.js";
import { CommandList } from "../commands/_CommandList";
import { Player } from "discord-player";
import botconfig from "../botconfig.json";

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

            if (element === filterSingle[0]) {
                console.log(
                    `${"-".repeat(process.stdout.columns / 5)}\n[${
                        message.content
                    }] was used\nUser: ${message.author.tag}\nGuild: ${
                        message.guild?.name
                    }\nTime: ${new Date().toLocaleTimeString(
                        "pt-BR"
                    )} at ${new Date().toLocaleDateString("pt-BR")}`
                );

                return await Command.run(client, message, args, player);
            }
        });
    }
};
