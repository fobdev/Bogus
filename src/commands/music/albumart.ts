import { Command } from "../../interfaces";
import { Response } from "../../models";

export const AlbumArt: Command = {
    name: ["albumart"],
    description: "Displays the album art of the current playing song.",
    run: async (prefix, client, message, args, player) => {
        const { channel, guild } = message;

        const displayingQueue = player?.getQueue(guild!.id);
        if (!displayingQueue)
            return channel.send({
                embeds: [
                    Response(
                        "There is nothing playing in this server.",
                        "Play something first.",
                        "WARN"
                    ),
                ],
            });
        else {
            return channel.send({
                embeds: [
                    Response(
                        `Album art of ${displayingQueue.current.title}`,
                        "",
                        "SUCCESS"
                    ).setImage(displayingQueue.current.thumbnail),
                ],
            });
        }
    },
};
