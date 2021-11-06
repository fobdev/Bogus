import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Earrape: Command = {
    name: ["earrape"],
    description: "Toggles the earrape effect.",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;
        const explodingQueue = player?.getQueue(guild!.id);

        if (!explodingQueue || !explodingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
            });

        const earrape = explodingQueue.getFiltersEnabled().includes("earrape");

        await explodingQueue.setFilters({
            earrape: !explodingQueue.getFiltersEnabled().includes("earrape"),
        });

        return channel.send({
            embeds: [
                Response(
                    `Earrape ${earrape ? "disabled" : "enabled"}.`,
                    `Use the command again to ${earrape ? "enable" : "disable"} it.`,
                    "OTHER",
                    "PURPLE"
                ),
            ],
        });
    },
};
