import { Command } from "../../interfaces";
import { Response } from "../../models";
import botconfig from "../../botconfig.json";

export const Jump: Command = {
    name: ["jump"],
    arguments: ["number"],
    description: "Jump to a specific track in the queue",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;

        let jumpingQueue = player?.getQueue(guild!.id);

        if (!jumpingQueue)
            return channel.send({
                embeds: [
                    Response(
                        "No queue in the server",
                        "Try using``" +
                            botconfig.prefix +
                            "play`` with a Spotify or Youtube playlist to easily create a queue for this server.",
                        "WARN"
                    ),
                ],
            });

        let jumpInput: number;
        try {
            jumpInput = parseInt(args![0]);
            jumpingQueue.jump(jumpInput - 1);
        } catch (e) {
            return channel.send({
                embeds: [Response("Error jumping to track.", "Please use a valid number.", "FAIL")],
            });
        }

        return await channel.send({
            embeds: [
                Response(
                    `Jumped to track number ${jumpInput} in the queue.`,
                    `Now loading **${jumpingQueue.tracks[0].title}**...`,
                    "OTHER",
                    "PURPLE"
                ).setThumbnail(jumpingQueue.tracks[0].thumbnail),
            ],
        });
    },
};
