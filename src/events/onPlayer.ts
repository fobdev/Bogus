import { Player, Queue, Track } from "discord-player";
import { Channel, Message } from "discord.js";
import { Response } from "../models";

export const onPlayer = async (player: Player) => {
    player.on("trackStart", function (queue, track) {
        // @ts-ignore
        return queue.metadata?.channel.send(`Now Playing: **${track.title}**`);
    });

    player.on("trackAdd", (queue: Queue, track: Track) => {
        // @ts-ignore
        return queue.metadata?.channel.send(`**${track.title}** added to the queue.`);
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

    player.on("botDisconnect", (queue: Queue) => {
        // @ts-ignore
        return queue.metadata?.channel.send("Bye!");
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
            embeds: [Response("Queue over!", "Leaving voice channel", "SUCCESS")],
        });
    });
};
