import { Client as DiscordClient, Intents } from "discord.js";
import { Player as PlayerClient } from "discord-player";
import { Pool } from "pg";
import { onGuildCreate, onPlayer, onMessage, onReady } from "./events";

(async () => {
    const client = new DiscordClient({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES,
        ],
    });

    const player = new PlayerClient(client, {
        ytdlOptions: {
            quality: "highestaudio",
            highWaterMark: 1024 * 1024 * 10,
            liveBuffer: 4000,
            dlChunkSize: 0,
            requestOptions: {
                maxRetries: 5,
                maxReconnects: 5,
            },
        },
    });

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    const postgres = await pool.connect();

    onPlayer(postgres, player);

    // calls when the client starts
    client.on("ready", async () => await onReady(client));

    client.on("guildCreate", async (guild) => await onGuildCreate(client, guild));

    // calls when a new message is sent in any channel
    client.on(
        "messageCreate",
        async (message) => await onMessage(client, player, postgres, message)
    );

    await client.login(process.env.BOT_TOKEN);
})();
