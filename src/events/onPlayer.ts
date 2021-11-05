import { Player, Queue, Track } from "discord-player";
import { Channel, Emoji, Message, MessageActionRow, MessageButton } from "discord.js";
import { Response } from "../models";
import botconfig from "../botconfig.json";

export const onPlayer = async (player: Player) => {
    player.on("trackStart", async (queue, track) => {
        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [
                Response(
                    `:musical_note: Now Playing: **${track.title}**`,

                    // @ts-ignore
                    `Requested in ${queue.metadata?.channel}.`,
                    "OTHER",
                    "PURPLE"
                )
                    .addField("Author:", track.author)
                    .addField("Duration:", track.duration, true)
                    .addField("Added by:", `${track.requestedBy}`, true)

                    .setThumbnail(track.thumbnail)
                    .setURL(track.url)
                    .setFooter(
                        `Next track: ${
                            queue.tracks.length > 0
                                ? `${queue.tracks[0].title} by ${queue.tracks[0].author}`
                                : "none"
                        }`
                    ),
            ],
        });
    });

    player.on("trackAdd", async (queue: Queue, track: Track) => {
        const trackPosition = queue.getTrackPosition(track);

        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [
                Response(
                    `[${track.title}] added to the queue ${
                        trackPosition === 0 ? `and playing next` : `at position [${trackPosition}]`
                    }`,
                    `${
                        trackPosition === 0
                            ? "You can use ``" +
                              `${botconfig.prefix}skip` +
                              "`` to play the track right now."
                            : "You can use ``" +
                              `${botconfig.prefix}jump ${trackPosition}` +
                              "`` to play the track right now."
                    }`,
                    "OTHER",
                    "PURPLE"
                )
                    .addField("Duration:", track.duration, true)
                    .addField("Added by: ", `${track.requestedBy}`, true)
                    .setThumbnail(track.thumbnail),
            ],
        });
    });

    player.on("tracksAdd", async (queue, tracks) => {
        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [
                Response(
                    `${tracks.length} tracks added to the queue.`,
                    "Use ``" + `${botconfig.prefix}queue` + "`` to see the result.",
                    "OTHER",
                    "PURPLE"
                )
                    .addField("Added by:", `${tracks[0].requestedBy}`)
                    .setThumbnail(tracks[0].thumbnail),
            ],
        });
    });

    player.on("error", async (queue: Queue, error) => {
        // attempt to play again
        console.error(error.message);

        if (error.message.includes("403")) {
            // @ts-ignore
            await queue.metadata?.channel.send({
                embeds: [
                    Response(
                        "Error trying to play.",
                        "**Error 403: Forbidden**\nThis is a problem with the YouTube player, please do your requests again.",
                        "FAIL"
                    ),
                ],
            });

            return queue.destroy(true);
        }
    });

    player.on("channelEmpty", async (queue: Queue) => {
        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [Response("No one in the voice channel.", "I'm leaving now.", "WARN")],
        });
    });

    player.on("queueEnd", async (queue: Queue) => {
        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [Response("I'm done.", "Leaving voice channel", "SUCCESS")],
        });
    });
};
