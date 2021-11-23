import { Guild } from "discord.js";
import { PoolClient as PostgresClient } from "pg";

export const createGuild = (postgres: PostgresClient, guild: Guild) => {
    return postgres.query(`INSERT INTO guilds(id, prefix, locale) VALUES (${guild.id}, '>', 'en')`);
};

export const deleteGuild = (postgres: PostgresClient, guild: Guild) => {
    return postgres.query(`DELETE FROM guilds WHERE id=${guild.id}`);
};

export const getPrefix = (postgres: PostgresClient, guild: Guild) => {
    return postgres
        .query({
            rowMode: "array",
            text: `SELECT prefix FROM guilds WHERE id=${guild.id}`,
        })
        .then((response) => {
            return response.rows[0][0];
        });
};

export const setPrefix = (postgres: PostgresClient, guild: Guild, newPrefix: string) => {
    return postgres.query(`UPDATE guilds SET prefix='${newPrefix}' WHERE id=${guild.id}`);
};

export const getLocale = (postgres: PostgresClient, guild: Guild) => {
    return postgres
        .query({
            rowMode: "array",
            text: `SELECT locale FROM guilds WHERE id=${guild.id}`,
        })
        .then((response) => {
            return response.rows[0][0];
        });
};

export const setLocale = (postgres: PostgresClient, guild: Guild, newLocale: string) => {
    return postgres.query(`UPDATE guilds SET locale='${newLocale}' WHERE id=${guild.id}`);
};

export const getGlobalResponse = (postgres: PostgresClient, guild: Guild) => {
    return postgres
        .query({
            rowMode: "array",
            text: `SELECT global_response FROM guilds WHERE id=${guild.id}`,
        })
        .then((response) => {
            return response.rows[0][0];
        });
};

export const setGlobalResponse = (postgres: PostgresClient, guild: Guild, newResponse: boolean) => {
    return postgres.query(
        `UPDATE guilds SET global_response='${newResponse}' WHERE id=${guild.id}`
    );
};
