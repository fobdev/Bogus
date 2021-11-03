import { Client, Message } from "discord.js";
export interface Command {
    name: Array<string>;
    arguments?: Array<string>; // Optional for documentation porpuses
    description: string; // Necessary for documentation porpuses
    run: (client: Client, message: Message, args?: Array<string>) => any;
}
