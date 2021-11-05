import { Client } from "discord.js";

export const onReady = async (client: Client) => {
    client.user?.setActivity(">help", { type: "LISTENING" });
    console.log(`===== Client connected as [${client.user?.username}] =====`);
    console.table(client.guilds.cache.map((guild) => guild.name));
};
