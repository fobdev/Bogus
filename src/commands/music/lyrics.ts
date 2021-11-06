import { Command } from "../../interfaces";
import { Response } from "../../models";
import { Lyrics } from "@discord-player/extractor";
import botconfig from "../../botconfig.json";

export const Lyric: Command = {
    name: ["lyrics", "ly"],
    arguments: ["?", "search"],
    description: "Display the lyrics of the current song, or search for the lyrics of a song.",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;
        const lyricsClient = Lyrics.init();
        const singingQueue = player?.getQueue(guild!.id);

        if (args![0]) {
            await lyricsClient
                .search(`${args!.join(" ")}`)
                .then((search) => {
                    return channel.send({
                        embeds: [
                            Response(
                                `Lyrics of ${search.title}`,
                                `${search.lyrics}`,
                                "OTHER",
                                "PURPLE"
                            ).setThumbnail(search.thumbnail),
                        ],
                    });
                })
                .catch((e: any) => {
                    console.error(e.message);
                    return channel.send({
                        embeds: [
                            Response(`Error`, `You request could not find any lyrics.`, "WARN"),
                        ],
                    });
                });
        } else {
            if (!singingQueue)
                return channel.send({
                    embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
                });

            await lyricsClient
                .search(`${singingQueue.current.title} ${singingQueue.current.author}`)
                .then((search) => {
                    return channel.send({
                        embeds: [
                            Response(
                                `Lyrics of ${singingQueue.current.title}`,
                                `${search.lyrics}`,
                                "OTHER",
                                "PURPLE"
                            )
                                .setThumbnail(search.thumbnail)
                                .setFooter(
                                    `If this was not what you're looking for, try using ${botconfig.prefix}lyrics [search]`
                                ),
                        ],
                    });
                })
                .catch((e: any) => {
                    console.error(e.message);
                    return channel.send({
                        embeds: [
                            Response(`Error`, `You request could not find any lyrics.`, "WARN"),
                        ],
                    });
                });
        }
    },
};
