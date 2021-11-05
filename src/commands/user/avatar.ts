import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Avatar: Command = {
    name: ["avatar", "pfp"],
    arguments: ["?", "user"],
    description: "Display the user or the mentioned user avatar.",
    run: async (client, message, args) => {
        const { channel, author } = message;
        let mentioned = message.mentions.members?.first();

        if (!mentioned)
            return channel.send({
                embeds: [
                    Response(`Avatar of ${author.tag}`, "", "SUCCESS").setImage(
                        author.displayAvatarURL({ size: 2048 })
                    ),
                ],
            });

        return channel.send({
            embeds: [
                Response(`Avatar of ${mentioned.user.tag}`, "", "SUCCESS").setImage(
                    mentioned.displayAvatarURL({ size: 2048 })
                ),
            ],
        });
    },
};
