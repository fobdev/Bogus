import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Nightcore: Command = {
    name: ["nightcore", "nc"],
    description: "Toggles the nightcore filter.",
    run: async (prefix, client, message, args, player) => {
        const { guild, channel } = message;
        const squeakingQueue = player?.getQueue(guild!.id);

        if (!squeakingQueue || !squeakingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
            });

        const nightcore = squeakingQueue.getFiltersEnabled().includes("nightcore");

        await squeakingQueue.setFilters({
            nightcore: !squeakingQueue.getFiltersEnabled().includes("nightcore"),
        });

        return channel.send({
            embeds: [
                Response(
                    `Nightcore is ${nightcore ? "ending" : "starting"}.`,
                    `This may take a second.\nUse the command again to ${
                        nightcore ? "enable" : "disable"
                    } it.`,
                    "OTHER",
                    "PURPLE"
                ),
            ],
        });
    },
};
