import { Command } from "../../interfaces";
import { Response } from "../../models";

export const PlayNext: Command = {
    name: ["playnext", "pn"],
    description: "Search a track and play it as the next track in the queue.",
    run: async (prefix, client, message, args, player) => {
        const { member, guild, channel } = message;

        if (guild?.me?.voice.channelId && member?.voice.channelId !== guild.me.voice.channelId)
            return channel.send({
                embeds: [
                    Response(
                        "Unable to run command.",
                        "The user is not in the same voice channel as the bot.",
                        "FAIL"
                    ),
                ],
            });

        const insertingQueue = player?.getQueue(guild!.id);

        if (!insertingQueue)
            return channel.send({
                embeds: [
                    Response(
                        `Please first create a queue before using this command.`,
                        "You can create a queue using ``" +
                            `${prefix}play [Youtube / Spotify playlist or video]` +
                            "``",
                        "FAIL"
                    ),
                ],
            });

        const userInput = args!.join(" ");

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
