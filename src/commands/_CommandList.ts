import { Command } from "../interfaces/";
import { HelloWorld } from "./admin/helloworld";
import { Ping } from "./bot/ping";
import { Help } from "./bot/help";
import { Clear } from "./admin/clear";
import { Kick } from "./admin/kick";
import { RenameServer } from "./admin/renameserver";
import { Ban } from "./admin/ban";
import { Invite } from "./bot/invite";
import { Music } from "./music/music";

export const CommandList: Command[] = [
    // Admin
    HelloWorld,
    Kick,
    Ban,
    Clear,
    RenameServer,

    // Bot
    Ping,
    Invite,
    Help,

    // Music
    Music,
];
