import { GuildMember, Permissions, Presence } from "discord.js";
import { Command } from "../../interfaces";
import { Response } from "../../models";
import { Chance } from "chance";

export const RussianRoulette: Command = {
    name: ["russianroulette", "roulette", "rr"],
    description:
        "Kick a random member from the guild.\nUser needs to have permission to kick members to use this command.",
    run: async (prefix, client, message) => {
        const { channel, member, author, guild } = message;

        if (!member?.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
            return channel.send({
                embeds: [
                    Response(
                        "Permission Denied",
                        "The user does not have permission to kick members.",
                        "FAIL"
                    ),
                ],
            });

        const kickableMembers: Array<GuildMember> = [];
        await (await guild?.members.list({ limit: 1000 }))!.map((member) => {
            if (member.kickable) kickableMembers.push(member);
        });

        return await kickableMembers[Chance().integer({ min: 0, max: kickableMembers.length - 1 })]
            .kick("Caught by the russian roulette.")
            .then((member) => {
                return channel.send({
                    embeds: [
                        Response(
                            `${member.user.tag} :gun: kicked by the russian roulette.`,
                            `${member.user.tag} got caught and was kicked from the server.`,
                            "OTHER",
                            "GOLD"
                        )
                            .setThumbnail(member.displayAvatarURL())
                            .setFooter(`Command called by ${message.author.tag}`),
                    ],
                });
            });
    },
};
