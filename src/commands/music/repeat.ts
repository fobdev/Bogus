import { QueueRepeatMode } from "discord-player";
import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Repeat: Command = {
    name: ["repeat"],
    arguments: ["?", "queue"],
    description: "Repeat the current track.",
    run: async (prefix, client, message, args, player) => {
        const { member, channel, guild } = message;
        const repeatingQueue = player?.getQueue(guild!.id);

        if (!repeatingQueue)
            return channel.send({
                embeds: [
                    Response(
                        "Not connected to any voice channel",
                        "Connect me to a voice channel first.",
                        "WARN"
                    ),
                ],
            });

        if (guild?.me?.voice.channelId && member?.voice.channelId !== guild.me.voice.channelId)
            return channel.send({
                embeds: [
                    Response(
                        "Unable to run command.",
                        "The user is not in the same voice channel as the bot.",
                        "FAIL"
                    ),
                ],
            });

        repeatingQueue.repeatMode === QueueRepeatMode.TRACK
            ? repeatingQueue.setRepeatMode(QueueRepeatMode.OFF)
            : repeatingQueue.setRepeatMode(QueueRepeatMode.TRACK);

        return await channel.send({
            embeds: [
                Response(
                    `Repeat is ${
                        repeatingQueue.repeatMode === QueueRepeatMode.TRACK ? "ON." : `OFF.`
                    }`,
                    repeatingQueue.repeatMode === QueueRepeatMode.TRACK
                        ? `Repeating track: ${repeatingQueue.current.title}`
                        : "",
                    "SUCCESS"
                ),
            ],
        });
    },
};
