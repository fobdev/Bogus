import { Command } from "../../interfaces";
import { Response } from "../../models";

export const EightD: Command = {
    name: ["8d"],
    description: "Toggles the vaporwave filter.",
    run: async (prefix, client, message, args, player) => {
        const { guild, channel } = message;
        const karaokingQueue = player?.getQueue(guild!.id);

        if (!karaokingQueue || !karaokingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
            });

        const eightD = karaokingQueue.getFiltersEnabled().includes("8D");

        await karaokingQueue.setFilters({
            "8D": !karaokingQueue.getFiltersEnabled().includes("8D"),
        });

        return channel.send({
            embeds: [
                Response(
                    `8D is ${eightD ? "ending" : "starting"}.`,
                    `This may take a second.\nUse the command again to ${
                        eightD ? "enable" : "disable"
                    } it.`,
                    "OTHER",
                    "PURPLE"
                ),
            ],
        });
    },
};
