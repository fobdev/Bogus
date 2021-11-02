import { Permissions } from "discord.js";
import { Command } from "../../interfaces";
import { Response } from "../../models";

export const RenameServer: Command = {
    name: "renameserver",
    description: "Renames the server (admin).",
    run: async (client, message) => {
        let { content, member, author, guild, channel } = message;
        if (!member?.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return channel.send({
                embeds: [
                    Response(
                        "Permission denied.",
                        "The user does not have permission to manage the server name.",
                        "FAIL"
                    ),
                ],
            });
        }

        let newname = content.split(" ").slice(1).join(" ");

        return guild
            ?.setName(newname)
            .then(() => {
                channel.send({
                    embeds: [
                        Response(
                            "The server name has changed!",
                            `**${author.tag}** changed the name of the server to **${newname}**`,
                            "SUCCESS"
                        ),
                    ],
                });
            })
            .catch((err) => {
                console.error(err);
                return channel.send({
                    embeds: [
                        Response(
                            "An error occured trying to change the name",
                            "Try using another name.",
                            "FAIL"
                        ),
                    ],
                });
            });
    },
};
