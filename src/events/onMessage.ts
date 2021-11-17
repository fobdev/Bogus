import { Client, Message } from "discord.js";
import { CommandList } from "../commands/_CommandList";
import { Player } from "discord-player";
import { PoolClient as PostgresClient } from "pg";
import { getPrefix } from "../db";
let commandCount = 0;

export const onMessage = async (
    client: Client,
    player: Player,
    postgres: PostgresClient,
    message: Message
) => {
    const prefix = (await getPrefix(postgres, message.guild!)).rows[0][0];

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
                commandCount++;
                console.log(`\n[${message.content}] command used (${commandCount} today)`);
                console.group();
                console.log(`User: [${message.author.tag}]`);
                console.log(`Serv: [${message.guild?.name}]`);
                console.log(
                    `Time: [${new Date().toLocaleTimeString(
                        "pt-BR"
                    )} at ${new Date().toLocaleDateString("pt-BR")}]`
                );
                console.groupEnd();

                return await Command.run(prefix, client, message, args, player, postgres);
            }
        });
    }
};
