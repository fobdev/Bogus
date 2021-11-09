import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Vaporwave: Command = {
    name: ["vaporwave", "vw"],
    description: "Toggles the vaporwave filter.",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;
        const vaporingQueue = player?.getQueue(guild!.id);

        if (!vaporingQueue || !vaporingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
            });

        const vaporwave = vaporingQueue.getFiltersEnabled().includes("vaporwave");

        await vaporingQueue.setFilters({
            vaporwave: !vaporingQueue.getFiltersEnabled().includes("vaporwave"),
        });

        return channel.send({
            embeds: [
                Response(
                    `Vaporwave is ${vaporwave ? "ending" : "starting"}.`,
                    `This may take a second.\nUse the command again to ${
                        vaporwave ? "enable" : "disable"
                    } it.`,
                    "OTHER",
                    "PURPLE"
                ),
            ],
        });
    },
};
