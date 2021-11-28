import { GuildMember, Permissions } from "discord.js";
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

        const memberlist = guild?.members.cache;
        const kickableMembers: Array<GuildMember> = [];
        for (let index = 0; index < memberlist!.size; index++) {
            const currentMember = memberlist?.at(index);
            if (currentMember?.kickable) kickableMembers.push(currentMember);
        }

        console.log(kickableMembers);

        if (kickableMembers.length === 0) return channel.send("No members to be kicked right now.");

        return await kickableMembers[Chance().integer({ min: 0, max: kickableMembers.length - 1 })]
            .kick("Caught by the russian roulette.")
            .then((member) => {
                return channel.send(`${member} has been caught by the russian roulette.`);
            });
    },
};
