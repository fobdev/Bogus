import { Command } from "../../interfaces";
import { Response } from "../../models";
import botconfig from "../../botconfig.json";
import { Resume } from "./resume";

export const Pause: Command = {
    name: ["pause"],
    description: "Pauses the current playing track.",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;
        const pausingQueue = player?.getQueue(guild!.id);

        if (!pausingQueue || !pausingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
            });

        const paused = pausingQueue.setPaused(true);
        return channel.send({
            embeds: [
                Response(
                    paused ? "Song Paused" : "Failed",
                    paused
                        ? "Use ``" + `${botconfig.prefix}${Resume.name[0]}` + "`` to resume it."
                        : "Looks like nothing is playing.",
                    paused ? "WARN" : "FAIL"
                ),
            ],
        });
    },
};
