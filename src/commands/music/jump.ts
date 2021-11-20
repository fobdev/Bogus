import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Jump: Command = {
    name: ["jump", "j"],
    arguments: ["number"],
    description: "Jump to a specific track in the queue",
    run: async (prefix, client, message, args, player) => {
        const { member, guild, channel } = message;

        if (guild?.me?.voice.channelId && member?.voice.channelId !== guild.me.voice.channelId)
            return channel.send({
                embeds: [
                    Response(
                        "Unable to run command.",
                        "The user is not in the same voice channel as the bot.",
                        "FAIL"
                    ),
                ],
            });

        const jumpingQueue = player?.getQueue(guild!.id);

        if (!jumpingQueue)
            return channel.send({
                embeds: [
                    Response(
                        "No queue in the server",
                        "Try using``" +
                            prefix +
                            "play`` with a Spotify or Youtube playlist to create a queue for this server.",
                        "WARN"
                    ),
                ],
            });

        let jumpInput: number;
        try {
            jumpInput = parseInt(args![0]);
            jumpingQueue.jump(jumpInput - 1);
        } catch (e) {
            return channel.send({
                embeds: [Response("Error jumping to track.", "Please use a valid number.", "FAIL")],
            });
        }

        return await channel.send({
            embeds: [
                Response(
                    `Jumped to track number ${jumpInput} in the queue.`,
                    `Now loading **${jumpingQueue.tracks[0].title}**...`,
                    "SUCCESS"
                ),
            ],
        });
    },
};
