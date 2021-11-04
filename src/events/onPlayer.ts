import { Player, Queue, Track } from "discord-player";
import { Channel, Emoji, Message, MessageActionRow, MessageButton } from "discord.js";
import { Response } from "../models";

export const onPlayer = async (player: Player) => {
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
