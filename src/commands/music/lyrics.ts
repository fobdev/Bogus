import { Command } from "../../interfaces";
import { Response } from "../../models";
import { Lyrics } from "@discord-player/extractor";
import { Util } from "discord.js";
import { Queue } from "../../../node_modules/discord-player/dist";

export const Lyric: Command = {
    name: ["lyrics", "ly"],
    arguments: ["?", "search"],
    description: "Display the lyrics of the current song, or search for the lyrics of a song.",
    run: async (prefix, client, message, args, player) => {
        const { guild, channel } = message;
        const lyricsClient = Lyrics.init();
        const singingQueue = player?.getQueue(guild!.id);

        const largeLyrics = (search: Lyrics.LyricsData, queue?: Queue) => {
            channel.send({
                embeds: [
                    Response(
                        `Lyrics of ${queue ? queue.current.title : search.title}`,
                        "The lyrics will be sent below because they're too big.",
                        "OTHER",
                        "PURPLE"
                    )
                        .setFooter(
                            `If this was not what you're looking for, try using ${prefix}lyrics [search]`
                        )
                        .setThumbnail(search.thumbnail),
                ],
            });

            Util.splitMessage(search.lyrics!).forEach((chunk) => {
                return channel.send(chunk);
            });
        };

        if (args![0]) {
            lyricsClient
                .search(`${args!.join(" ")}`)
                .then((search) => {
                    if (search.lyrics!.length < 4096)
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

                    largeLyrics(search);
                })
                .catch((e: any) => {
                    console.error("No lyrics found: ", e.message);
                    return channel.send({
                        embeds: [
                            Response(
                                `Error`,
                                `You request could not find any lyrics.`,
                                "WARN"
                            ).setFooter(
                                `You can also use ${prefix}lyrics [search] to search for a specific song.`
                            ),
                        ],
                    });
                });
        } else {
            if (!singingQueue)
                return channel.send({
                    embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
                });

            lyricsClient
                .search(`${singingQueue.current.title} ${singingQueue.current.author}`)
                .then((search) => {
                    if (search.lyrics!.length < 4096)
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
                                        `If this was not what you're looking for, try using ${prefix}lyrics [search]`
                                    ),
                            ],
                        });

                    largeLyrics(search, singingQueue);
                })
                .catch((e: any) => {
                    console.error("No lyrics found: ", e.message);
                    return channel.send({
                        embeds: [
                            Response(
                                `Error`,
                                `You request could not find any lyrics.`,
                                "WARN"
                            ).setFooter(
                                `You can also use ${prefix}lyrics [search] to search for a specific song.`
                            ),
                        ],
                    });
                });
        }
    },
};
