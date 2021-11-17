import { Player, Queue, Track } from "discord-player";
import { getPrefix } from "../db";
import { Response } from "../models";
import { PoolClient } from "pg";

export const onPlayer = async (postgres: PoolClient, player: Player) => {
    player.on("trackStart", async (queue, track) => {
        const responseEmbed = Response(
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
            .setURL(track.url);

        if (queue.tracks.length > 0)
            responseEmbed.setFooter(
                `Next track: ${queue.tracks[0].title} by ${queue.tracks[0].author}`
            );

        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [responseEmbed],
        });
    });

    player.on("trackAdd", async (queue: Queue, track: Track) => {
        const prefix = getPrefix(postgres, queue.guild);
        const trackPosition = queue.getTrackPosition(track) + 1;

        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [
                Response(
                    `[${track.title}] added to the queue ${
                        trackPosition === 1 ? `and playing next` : `at position [${trackPosition}]`
                    }`,
                    `${
                        trackPosition === 1
                            ? "You can use ``" + `${prefix}skip` + "`` to play the track right now."
                            : "You can use ``" +
                              `${prefix}jump ${trackPosition}` +
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
        const prefix = getPrefix(postgres, queue.guild);

        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [
                Response(
                    `${tracks.length} tracks added to the queue.`,
                    "Use ``" + `${prefix}queue` + "`` to see the result.",
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
        console.error(error);

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
