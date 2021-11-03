import { Client, Intents } from "discord.js";
import { onMessage } from "./events/onMessage";
import { onReady } from "./events/onReady";

(async () => {
    const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    // calls when the client starts
    client.on("ready", async () => await onReady());

    // calls when a new message is sent in any channel
    client.on("messageCreate", async (message) => await onMessage(client, message));

    await client.login(process.env.BOT_TOKEN);
})();
