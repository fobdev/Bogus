import { Command } from "../../interfaces";
import { Response } from "../../models";
import botconfig from "../../botconfig.json";

export const PlayNext: Command = {
    name: ["playnext", "pn"],
    description: "",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;
        const insertingQueue = player?.getQueue(guild!.id);

        if (!insertingQueue)
            return channel.send({
                embeds: [
                    Response(
                        `Please first create a queue before using this command.`,
                        "You can create a queue using ``" +
                            `${botconfig.prefix}play [Youtube / Spotify playlist or video]` +
                            "``",
                        "FAIL"
                    ),
                ],
            });

        const userInput = args![0];

        const searchResult = await player!
            .search(userInput, { requestedBy: message.author })
            .catch((e) => console.error("Search error: ", e));

        if (!searchResult || !searchResult.tracks.length)
            return channel.send({
                embeds: [Response("Search error", "Sorry, nothing was found", "FAIL")],
            });

        const nextTrack = searchResult.tracks[0];

        try {
            return insertingQueue?.insert(nextTrack);
        } catch (e: any) {
            return console.error(e.message);
        }
    },
};