import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Back: Command = {
    name: ["back"],
    description: "Play the last played track again.",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;
        const backingQueue = player?.getQueue(guild!.id);

        if (!backingQueue || !backingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
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
