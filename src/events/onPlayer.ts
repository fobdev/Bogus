import { Player, Queue, Track } from "discord-player";
import { Channel, Message } from "discord.js";
import { Response } from "../models";

export const onPlayer = async (player: Player) => {
    player.on("trackStart", (queue, track) => {
        // @ts-ignore
        return queue.metadata?.channel.send(`Now Playing: **${track.title}** (${track.duration})`);
    });

    player.on("trackEnd", (queue, track) => {
        if (queue.tracks.length > 0)
            // @ts-ignore
            return queue.metadata?.channel.send(`Now loading: **${queue.tracks[0].title}**...`);
    });

    player.on("trackAdd", (queue: Queue, track: Track) => {
        // @ts-ignore
        return queue.metadata?.channel.send(`Added to the queue: **${track}** (${track.duration})`);
    });

    player.on("error", (queue: Queue, error) => {
        console.log(error);

        // @ts-ignore
        return queue.metadata?.channel.send({
            embeds: [
                Response(
                    "Error",
                    "An YouTube error occurred, please make your request again.",
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
