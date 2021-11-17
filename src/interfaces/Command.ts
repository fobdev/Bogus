import { PoolClient as PostgresClient } from "pg";
import { Player } from "discord-player";
import { Client, Message } from "discord.js";
export interface Command {
    name: Array<string>;
    arguments?: Array<string>; // Optional for documentation porpuses
    description: string; // Necessary for documentation porpuses
    run: (
        prefix: string,
        client: Client,
        message: Message,
        args?: Array<string>,
        player?: Player,
        postgres?: PostgresClient
    ) => any;
}
