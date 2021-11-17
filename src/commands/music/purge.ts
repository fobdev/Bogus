import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Purge: Command = {
    name: ["purge", "pg"],
    description: "Purges the current queue.",
    run: async (prefix, client, message, args, player) => {
        const { guild, channel } = message;
        const purgingQueue = player?.getQueue(guild!.id);

        if (!purgingQueue || !purgingQueue.playing)
            return channel.send({
                embeds: [
                    Response(
                        "Nothing is playing right now.",
                        "Please play something before using this command",
                        "WARN"
                    ),
                ],
            });

        purgingQueue.clear();

        return channel.send({
            embeds: [
                Response(
                    "Queue purged.",
                    "All the songs in the server queue have been removed.",
                    "WARN"
                ),
            ],
        });
    },
};
