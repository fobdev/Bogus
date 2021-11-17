import { Permissions } from "discord.js";
import { setPrefix } from "../../db";
import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Prefix: Command = {
    name: ["prefix"],
    description: "Changes the bot prefix for this server.",
    run: async (prefix, client, message, args, player, postgres) => {
        const { member, channel, guild } = message;

        if (!member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return channel.send({
                embeds: [
                    Response(
                        "Permission denied.",
                        "Only admins can change the bot prefix of the server.",
                        "FAIL"
                    ),
                ],
            });
        }

        if (!args![0] || args!.length > 1 || args![0].length > 3)
            return channel.send({
                embeds: [
                    Response(
                        "Error",
                        "Please input a valid prefix with a max. of 3 characters.",
                        "FAIL"
                    ),
                ],
            });

        await setPrefix(postgres!, guild!, args![0]);
        return channel.send({
            embeds: [
                Response(
                    `${guild?.name} prefix changed.`,
                    `The new prefix of the guild is now ${args![0]}`,
                    "SUCCESS"
                ),
            ],
        });
    },
};
