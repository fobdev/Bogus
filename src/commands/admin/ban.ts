import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Ban: Command = {
    name: ["ban"],
    arguments: ["member"],
    description: "Bans a user from the server",
    run: async (client, message) => {
        let { content, channel, author, member, mentions } = message;

        if (!member?.permissions.has("BAN_MEMBERS")) {
            return channel.send({
                embeds: [
                    Response(
                        "Permission Denied",
                        "The user does not have permission to kick members.",
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
                        "You need to tag a user to be banned!",
                        "FAIL"
                    ),
                ],
            });
        }

        // separate all the string from the function call
        let args = content.split(" ").slice(2);

        if (!args) {
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

        // set the reason to a default of after the ban days
        let ban_days = parseInt(args[0]);
        let ban_reason = args.slice(1, args.length);

        // check if there is a number after the user
        if (isNaN(ban_days)) {
            ban_reason = args;

            // if the reason is the whole args, then there is no day selected (default 0).
            await ban_member.ban({ reason: ban_reason.toString() });
            return channel.send({
                embeds: [
                    Response(
                        "User banned!",
                        `**${author.tag}** banned **${ban_member.user.tag}** from the server`,
                        "SUCCESS"
                    ),
                ],
            });
        }

        // now checking the possibility of having a reason and a ban_days
        if (ban_days > 7 || ban_days < 0) {
            return channel.send({
                embeds: [
                    Response(
                        "Error executing the command",
                        "You can't ban someone for more than 7 days" +
                            "\nBut you can ban someone for a **indefinite amount of time using 0 in the days**",
                        "FAIL"
                    ),
                ],
            });
        }

        // finally, if there is a reason and a ban_days, do the whole function.
        await ban_member.ban({ reason: ban_reason.join(" "), days: ban_days });

        return channel.send({
            embeds: [
                Response(
                    "User banned!",
                    `**${author.tag}** banned **${ban_member.user.tag}** from the server`,
                    "SUCCESS"
                )
                    .addField("Reason: ", ban_reason.join(" "), true)
                    .addField("Days: ", ban_days.toString(), true),
            ],
        });
    },
};
