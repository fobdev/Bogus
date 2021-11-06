import { PlayerSubscription } from "@discordjs/voice";
import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Resume: Command = {
    name: ["resume"],
    description: "Resumes a paused track.",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;
        const resumingQueue = player?.getQueue(guild!.id);

        if (!resumingQueue || !resumingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
            });

        const resumed = resumingQueue.setPaused(false);
        return channel.send({
            embeds: [
                Response(
                    resumed ? "Playing again" : "Failed",
                    resumed
                        ? `**${resumingQueue.current.title}**`
                        : "Looks like nothing is paused.",
                    resumed ? "SUCCESS" : "FAIL"
                ),
            ],
        });
    },
};