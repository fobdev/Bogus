import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Back: Command = {
    name: ["back"],
    description: "Play the last played track again.",
    run: async (prefix, client, message, args, player) => {
        const { member, guild, channel } = message;
        const backingQueue = player?.getQueue(guild!.id);

        if (!backingQueue || !backingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
            });

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

        try {
            await backingQueue.back();
        } catch (error) {
            return channel.send({
                embeds: [
                    Response(
                        `Error with last track.`,
                        `Could not find any tracks, please play something before using this command.`,
                        "FAIL"
                    ),
                ],
            });
        }

        return channel.send({
            embeds: [
                Response(
                    `Playing previous track again.`,
                    `Now loading **${backingQueue.previousTracks[1].title}**...`,
                    "SUCCESS"
                ),
            ],
        });
    },
};
