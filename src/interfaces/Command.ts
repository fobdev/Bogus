import { Client, Message } from "discord.js";
export interface Command {
    name: Array<string>;
    description: string;
    run: (client: Client, message: Message, args?: Array<string>) => any;
}
