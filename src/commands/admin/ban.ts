import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Ban: Command = {
    name: ["ban"],
    arguments: ["member"],
    description: "Bans a user from the server",
    run: async (client, message, args) => {
        let { content, channel, author, member, mentions } = message;

        if (!member?.permissions.has("BAN_MEMBERS")) {
            return channel.send({
                embeds: [
                    Response(
                        "Permission Denied",
                        "The member does not have permission to kick members.",
                        "FAIL"
                    ),
                ],
            });
        }

        let ban_member = mentions.members?.first();

        if (!ban_member) {
            return channel.send({
                embeds: [
                    Response(
                        "Error running the command",
                        "You need to tag a member to be banned!",
                        "FAIL"
                    ),
                ],
            });
        }

        // separate all the string from the function call
        let reason = args!.slice(1);

        if (!reason) {
            await ban_member.ban();
            return channel.send({
                embeds: [
                    Response(
                        "User banned!",
                        `**${author.tag}** banned **${ban_member.user.tag}** from the server.`,
                        "SUCCESS"
                    ),
                ],
            });
        }

        // finally, if there is a reason and a ban_days, do the whole function.
        await ban_member.ban({ reason: reason.join(" ") });

        return channel.send({
            embeds: [
                Response(
                    "User banned!",
                    `**${author.tag}** banned **${ban_member.user.tag}** from the server`,
                    "SUCCESS"
                ).addField("Reason: ", reason.join(" "), true),
            ],
        });
    },
};
