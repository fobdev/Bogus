import { Player, Queue, Track } from "discord-player";
import { Channel, Emoji, Message, MessageActionRow, MessageButton } from "discord.js";
import { Response } from "../models";

export const onPlayer = async (player: Player) => {
    let editableResponse = player.on("trackStart", (queue, track) => {
        // @ts-ignore
        return queue.metadata?.channel.send({
            embeds: [
                Response(
                    `:musical_note: Now Playing: **${track.title}**`,
                    `Duration: ${track.duration}\nAuthor: ${track.author}\nAdded by: ${track.requestedBy}`,
                    "OTHER",
                    "PURPLE"
                )
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

    player.on("trackAdd", (queue: Queue, track: Track) => {
        // @ts-ignore
        return queue.metadata?.channel.send(`Added to the queue: **${track}** (${track.duration})`);
    });

    player.on("error", (queue: Queue, error) => {
        console.log(error);

        if (error.name === "DestroyedQueue") return;
        // @ts-ignore
        return queue.metadata?.channel.send({
            embeds: [
                Response(
                    "Error 403",
                    "This error is not your fault, **Just do your request again, should be fine.**",
                    "FAIL"
                ),
            ],
        });
    });

    player.on("channelEmpty", (queue: Queue) => {
        // @ts-ignore
        return queue.metadata?.channel.send({
            embeds: [Response("No one in the voice channel.", "I'm leaving now.", "WARN")],
        });
    });

    player.on("queueEnd", (queue: Queue) => {
        // @ts-ignore
        return queue.metadata?.channel.send({
            embeds: [Response("I'm done.", "Leaving voice channel", "SUCCESS")],
        });
    });
};
