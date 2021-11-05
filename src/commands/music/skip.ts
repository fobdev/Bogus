import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Skip: Command = {
    name: ["skip", "s"],
    description: "Skip the current track.",
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
