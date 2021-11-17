import { Client as DiscordClient, Guild } from "discord.js";

export const onGuildCreate = async (client: DiscordClient, guild: Guild) => {
    const guilds = client.guilds.cache;

    client.user?.setActivity(`>help @ ${guilds.size} servers`, {
        type: "LISTENING",
    });

    console.log(`==========\nClient added to: [${guild.name}]\n==========`);
    console.table(guilds.map((guild) => guild.name));
};
