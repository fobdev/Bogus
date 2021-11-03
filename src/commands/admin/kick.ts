import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Kick: Command = {
    name: ["kick"],
    arguments: ["member"],
    description: "Kick a user from the server.",
    run: async (client, message) => {
        let { channel, author, member } = message;
        if (!member?.permissions.has("KICK_MEMBERS")) {
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

        let kick_member = message.mentions.members?.first();

        if (!kick_member)
            return channel.send({
                embeds: [
                    Response(
                        "Error running the command",
                        "You need to tag a user to be kicked!",
                        "FAIL"
                    ),
                ],
            });

        try {
            await kick_member?.kick();
            return channel.send({
                embeds: [
                    Response(
                        "Member kicked from the server",
                        `**<@${author.tag}>** kicked **<@${kick_member?.user.id}>** from the server.`,
                        "WARN"
                    ).setThumbnail(kick_member?.user.displayAvatarURL({ dynamic: true })!),
                ],
            });
        } catch (e: any) {
            return channel.send({
                embeds: [
                    Response("Error occured trying to kick member", `Error: ${e.message}`, "FAIL"),
                ],
            });
        }
    },
};
