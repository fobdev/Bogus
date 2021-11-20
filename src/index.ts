import { Client as DiscordClient, Intents } from "discord.js";
import { Player as PlayerClient } from "discord-player";
import { Pool } from "pg";
import { onGuildDelete, onGuildCreate, onPlayer, onMessage, onReady } from "./events";
import HttpsProxyAgent from "https-proxy-agent";
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

    const agent = HttpsProxyAgent("http://111.111.111.111:8080");

    const player = new PlayerClient(client, {
        ytdlOptions: {
            quality: "highestaudio",
            highWaterMark: 1024 * 1024 * 10,
            liveBuffer: 4000,
            dlChunkSize: 0,
            requestOptions: {
                agent,
                headers: {
                    Cookie: "SID=DgjQO5f-TxwqIDQc2MZgIvoBorFdPTbMkD_z567KH9l0n9AgqfFduYoJmcAWY7Y5lBnFuw.;HSID=ARs6cHabtXDtW3ZDP;SSID=A0Wcf5kOmyy5JfgbO",
                },
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
