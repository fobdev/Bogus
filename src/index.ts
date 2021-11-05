import { Client, Intents } from "discord.js";
import { onMessage, onReady } from "./events";
import { Player } from "discord-player";
import { onPlayer } from "./events/onPlayer";

(async () => {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES,
        ],
    });

    const player = new Player(client);

    onPlayer(player);

    // calls when the client starts
    client.on("ready", async () => await onReady(client));

    // calls when a new message is sent in any channel
    client.on("messageCreate", async (message) => await onMessage(client, player, message));

    await client.login(process.env.BOT_TOKEN);
})();
