import { MessageAttachment } from "discord.js";
import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Avatar: Command = {
    name: ["avatar", "pfp"],
    arguments: ["?", "user"],
    description: "Display the user or the mentioned user avatar.",
    run: async (prefix, client, message, args) => {
        const { channel, author } = message;
        let mentioned = message.mentions.members?.first();

        if (!mentioned) {
            return channel.send({
                files: [
                    new MessageAttachment(author.displayAvatarURL({ size: 2048, format: "gif" })),
                ],
            });
        }

        return channel.send({
            files: [
                new MessageAttachment(mentioned.displayAvatarURL({ size: 2048, format: "gif" })),
            ],
        });
    },
};
