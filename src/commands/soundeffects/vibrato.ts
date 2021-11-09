import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Vibrato: Command = {
    name: ["vibrato", "vb"],
    description: "Toggles the earrape filter.",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;
        const vibratingQueue = player?.getQueue(guild!.id);

        if (!vibratingQueue || !vibratingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
            });

        const vibrato = vibratingQueue.getFiltersEnabled().includes("vibrato");

        vibratingQueue.setFilters({
            vibrato: !vibratingQueue.getFiltersEnabled().includes("vibrato"),
        });

        return channel.send({
            embeds: [
                Response(
                    `Vibrato is ${vibrato ? "ending" : "starting"}.`,
                    `This may take a second.\nUse the command again to ${
                        vibrato ? "enable" : "disable"
                    } it.`,
                    "OTHER",
                    "PURPLE"
                ),
            ],
        });
    },
};
