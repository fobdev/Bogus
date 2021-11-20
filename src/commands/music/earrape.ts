import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Earrape: Command = {
    name: ["earrape"],
    description: "Increase the volume of the player by a lot, use it again to disable it.",
    run: async (prefix, client, message, args, player) => {
        const { guild, channel } = message;
        const explodingQueue = player?.getQueue(guild!.id);

        if (!explodingQueue || !explodingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
            });

        explodingQueue.volume === 100
            ? await explodingQueue.setVolume(100000)
            : await explodingQueue.setVolume(100);

        return channel.send({
            embeds: [
                Response(
                    `Earrape is now ${explodingQueue.volume === 100 ? "Disabled" : "Enabled"}`,
                    `Use ${prefix}earrape to ${
                        explodingQueue.volume === 100 ? "enable" : "disable"
                    } it.`,
                    "OTHER",
                    "PURPLE"
                ),
            ],
        });
    },
};
