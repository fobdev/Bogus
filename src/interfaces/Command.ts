import { Client, Message } from "discord.js";
export interface Command {
    name: string;
    description: string;
    run: (client: Client, message: Message, args?: Array<string>) => any;
}
