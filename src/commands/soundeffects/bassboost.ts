import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Boost: Command = {
    name: ["bassboost", "bb"],
    description: "Toggle the bassboost filter",
    run: async (prefix, client, message, args, player) => {
        const { guild, channel } = message;
        const boostingQueue = player?.getQueue(guild!.id);

        if (!boostingQueue || !boostingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
            });

        const booster = boostingQueue.getFiltersEnabled().includes("bassboost");

        await boostingQueue.setFilters({
            bassboost: !boostingQueue.getFiltersEnabled().includes("bassboost"),
            normalizer2: !boostingQueue.getFiltersEnabled().includes("normalizer2"),
        });

        return channel.send({
            embeds: [
                Response(
                    `Bass booster is ${booster ? "ending" : "starting"}.`,
                    `This may take a second.\nUse the command again to ${
                        booster ? "enable" : "disable"
                    } it.`,
                    "OTHER",
                    "PURPLE"
                ),
            ],
        });
    },
};
