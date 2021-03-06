import { Client as DiscordClient, Intents } from "discord.js";
import { Player as PlayerClient } from "discord-player";
import { Pool } from "pg";
import { onGuildDelete, onGuildCreate, onPlayer, onMessage, onReady } from "./events";
import axios, { AxiosInstance } from "axios";

// image processing server
export let api: AxiosInstance;

(async () => {
    const client = new DiscordClient({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES,
        ],
    });

    const player = new PlayerClient(client);

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    const postgres = await pool.connect();

    onPlayer(postgres, player);

    // calls when the client starts
    client.on("ready", async () => await onReady(client));

    client.on("guildCreate", async (guild) => await onGuildCreate(client, postgres, guild));

    client.on("guildDelete", async (guild) => await onGuildDelete(client, postgres, guild));

    // calls when a new message is sent in any channel
    client.on(
        "messageCreate",
        async (message) => await onMessage(client, player, postgres, message)
    );

    api = await axios.create({ baseURL: "https://bogus-image-processing.herokuapp.com/" });

    await client.login(process.env.BOT_TOKEN);
})();
