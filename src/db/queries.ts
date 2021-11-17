import { Guild } from "discord.js";
import { PoolClient as PostgresClient } from "pg";

export const getPrefix = (postgres: PostgresClient, guild: Guild) => {
    return postgres.query({
        rowMode: "array",
        text: `SELECT prefix FROM guilds WHERE id=${guild.id}`,
    });
};

export const setPrefix = (postgres: PostgresClient, guild: Guild, newPrefix: string) => {
    return postgres.query(`UPDATE guilds SET prefix='${newPrefix}' WHERE id=${guild.id}`);
};

export const getLocale = (postgres: PostgresClient, guild: Guild) => {
    return postgres.query({
        rowMode: "array",
        text: `SELECT locale FROM guilds WHERE id=${guild.id}`,
    });
};

export const setLocale = (postgres: PostgresClient, guild: Guild, newLocale: string) => {
    return postgres.query(`UPDATE guilds SET locale='${newLocale}' WHERE id=${guild.id}`);
};
