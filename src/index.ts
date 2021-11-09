import { Client, Intents } from "discord.js";
import { onGuildCreate, onPlayer, onMessage, onReady } from "./events";
import { Player } from "discord-player";

(async () => {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES,
        ],
    });

    const player = new Player(client, {
        ytdlOptions: {
            quality: "highestaudio",
            highWaterMark: 1024 * 1024 * 10,
            liveBuffer: 4000,
            dlChunkSize: 0,
            requestOptions: {
                maxRetries: 5,
                maxReconnects: 5,
                headers: {
                    cookie: process.env.YOUTUBE_COOKIE,
                },
            },
        },
    });

    onPlayer(player);

    // calls when the client starts
    client.on("ready", async () => await onReady(client));

    client.on("guildCreate", async (guild) => await onGuildCreate(client, guild));

    // calls when a new message is sent in any channel
    client.on("messageCreate", async (message) => await onMessage(client, player, message));

    await client.login(process.env.BOT_TOKEN);
})();
