import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Skip: Command = {
    name: ["skip", "s"],
    arguments: ["?", "amount"],
    description: "Skip the current track to the next track or to a specific track in the queue.",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;
        const skippingQueue = player?.getQueue(guild!.id);
        if (!skippingQueue)
            return channel.send({
                embeds: [
                    Response(
                        "Nothing is being played.",
                        "You need to play something first.",
                        "WARN"
                    ),
                ],
            });

        if (args![0]) {
            try {
                const skipAmount = parseInt(args![0]) - 1;
                if (skipAmount < skippingQueue.tracks.length && skipAmount > 0) {
                    skippingQueue?.skipTo(skipAmount);
                    return channel.send({
                        embeds: [
                            Response(
                                `Skipped to track number ${skipAmount} in the queue.`,
                                `Now Loading **${skippingQueue?.tracks[0].title}**...`,
                                "SUCCESS"
                            ),
                        ],
                    });
                }

                return channel.send({
                    embeds: [
                        Response(
                            `Error using Skip command.`,
                            `You need to input a valid number.`,
                            "FAIL"
                        ),
                    ],
                });
            } catch (e: any) {
                return channel.send({
                    embeds: [
                        Response(
                            `An error occurred trying to skip.`,
                            `Error: ${e.message}`,
                            "FAIL"
                        ),
                    ],
                });
            }
        }

        let success;
        success = skippingQueue!.skip();
        if (success && skippingQueue.tracks.length > 0)
            return channel.send({
                embeds: [
                    Response(
                        success ? "Track Skipped" : "Error Skipping Track",
                        success
                            ? `Now loading: **${skippingQueue.tracks[0].title}**...`
                            : "Error trying to skip track",
                        success ? "SUCCESS" : "FAIL"
                    ),
                ],
            });
        else return;
    },
};
