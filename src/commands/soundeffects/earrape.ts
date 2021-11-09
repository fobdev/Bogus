import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Earrape: Command = {
    name: ["earrape", "er"],
    description: "Toggles the earrape filter.",
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
                    `Earrape is ${earrape ? "ending" : "starting"}.`,
                    `This may take a second.\nUse the command again to ${
                        earrape ? "enable" : "disable"
                    } it.`,
                    "OTHER",
                    "PURPLE"
                ),
            ],
        });
    },
};
