import { Guild, Client } from "discord.js";
import { onReady } from ".";

export const onGuildCreate = async (client: Client, guild: Guild) => {
    console.log(`==========\nClient added to: [${guild.name}]\n==========`);

    const guilds = client.guilds.cache;
    console.table(guilds.map((guild) => guild.name));
};
