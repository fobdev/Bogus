import { Command } from "../../interfaces";
import { Response } from "../../models";
import botconfig from "../../botconfig.json";

export const NowPlaying: Command = {
    name: ["nowplaying", "np"],
    description: "Display the currently playing track.",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;
        const nowPlayingQueue = player?.getQueue(guild!.id);

        if (!nowPlayingQueue)
            return channel.send({
                embeds: [
                    Response(
                        "Nothing is playing at the moment.",
                        "Use ``" +
                            `${botconfig.prefix}play [link/playlist]` +
                            "`` to start playing something.",
                        "WARN"
                    ),
                ],
            });

        let currentTrack = nowPlayingQueue.nowPlaying();

        return channel.send({
            embeds: [
                Response(
                    `:musical_note: Now Playing: **${currentTrack.title}**`,

                    // @ts-ignore
                    `Requested in ${nowPlayingQueue.metadata?.channel}.`,
                    "OTHER",
                    "PURPLE"
                )
                    .addField("Author:", currentTrack.author)
                    .addField("Duration:", currentTrack.duration, true)
                    .addField("Added by:", `${currentTrack.requestedBy}`, true)

                    .setThumbnail(currentTrack.thumbnail)
                    .setURL(currentTrack.url)
                    .setFooter(
                        `Next track: ${
                            nowPlayingQueue.tracks.length > 0
                                ? `${nowPlayingQueue.tracks[0].title} by ${nowPlayingQueue.tracks[0].author}`
                                : "none"
                        }`
                    ),
            ],
        });
    },
};
