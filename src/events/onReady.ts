import { Client } from "discord.js";

export const onReady = async (client: Client) => {
    client.user?.setActivity(">help", { type: "LISTENING" });

    return console.log("Client is Online!");
};
