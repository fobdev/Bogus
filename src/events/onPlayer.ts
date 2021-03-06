import { Player, Queue, QueueRepeatMode, Track } from "discord-player";
import { getPrefix } from "../db";
import { Response } from "../models";
import { PoolClient } from "pg";

export const onPlayer = async (postgres: PoolClient, player: Player) => {
    player.on("trackStart", async (queue, track) => {
        const membercount = queue.connection.channel.members.size - 1;
        console.log(
            `[CONNECTION] Playing [${track.title}] to [${queue.connection.channel.name}] at [${
                queue.guild.name
            }] to ${membercount} ${membercount > 1 ? "members" : "member"}.`
        );

        const responseEmbed = Response(
            `:musical_note: ${
                queue.repeatMode === QueueRepeatMode.TRACK ? ":repeat:" : ":arrow_forward:"
            } Now ${queue.repeatMode === QueueRepeatMode.TRACK ? "Repeating" : "Playing"}: **${
                track.title
            }**`,

            // @ts-ignore
            `Requested in ${queue.metadata?.channel}.`,
            "OTHER",
            "PURPLE"
        )
            .addField("Author:", track.author)
            .addField("Duration:", track.durationMS === 0 ? "Livestream" : track.duration, true)
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
        const prefix = await getPrefix(postgres, queue.guild);
        const trackPosition = queue.getTrackPosition(track) + 1;

        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [
                Response(
                    `[${track.title}] added to the queue ${
                        trackPosition === 0 ? `and playing next` : `at position ${trackPosition}`
                    }`,
                    `${
                        trackPosition === 1
                            ? "You can use ``" +
                              `${await prefix}skip` +
                              "`` to play the track right now."
                            : trackPosition > 1
                            ? "You can use ``" +
                              `${prefix}jump ${trackPosition}` +
                              "`` to play the track right now."
                            : ""
                    }`,
                    "OTHER",
                    "PURPLE"
                )
                    .addField(
                        "Duration:",
                        track.durationMS === 0 ? "Livestream" : track.duration,
                        true
                    )
                    .addField("Added by: ", `${track.requestedBy}`, true)
                    .setThumbnail(track.thumbnail),
            ],
        });
    });

    player.on("tracksAdd", async (queue, tracks) => {
        const prefix = await getPrefix(postgres, queue.guild);
        const firstPosition = queue.getTrackPosition(tracks[0]) + 1;

        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [
                Response(
                    `${tracks.length} tracks added to the queue.`,
                    "Use ``" +
                        `${prefix}queue` +
                        "`` to see the result." +
                        `${
                            firstPosition !== 0
                                ? "\nOr use ``" +
                                  `${prefix}skip ${firstPosition}` +
                                  "`` to go straight to the first track in this playlist."
                                : ""
                        }`,
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
        console.log(
            `[CONNECTION] Left voice channel [${queue.connection.channel.name}] at [${queue.guild.name}].`
        );

        // @ts-ignore
        return await queue.metadata?.channel.send({
            embeds: [Response("I'm done.", "Leaving voice channel", "SUCCESS")],
        });
    });
};
