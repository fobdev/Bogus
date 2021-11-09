import { Guild, Client } from "discord.js";
import botconfig from "../botconfig.json";
import { onReady } from ".";

export const onGuildCreate = async (client: Client, guild: Guild) => {
    const guilds = client.guilds.cache;

    client.user?.setActivity(`${botconfig.prefix}help @ ${guilds.size} servers`, {
        type: "LISTENING",
    });

    console.log(`==========\nClient added to: [${guild.name}]\n==========`);
    console.table(guilds.map((guild) => guild.name));
};
