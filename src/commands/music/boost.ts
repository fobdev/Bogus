import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Boost: Command = {
    name: ["bassboost"],
    description: "Toggle the bass boost filter",
    run: async (client, message, args, player) => {
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
                    `Bass booster ${booster ? "disabled" : "enabled"}.`,
                    `Use the command again to ${booster ? "enable" : "disable"} it.`,
                    "OTHER",
                    "PURPLE"
                ),
            ],
        });
    },
};
