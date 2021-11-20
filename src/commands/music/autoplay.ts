import { QueueRepeatMode } from "discord-player";
import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Autoplay: Command = {
    name: ["autoplay"],
    description: "Toggles autoplay of tracks.",
    run: async (prefix, client, message, args, player) => {
        const { member, channel, guild } = message;
        const autoPlayingQueue = player?.getQueue(guild!.id);

        if (!autoPlayingQueue)
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

        if (autoPlayingQueue.current.url.includes("spotify"))
            return channel.send({
                embeds: [
                    Response(
                        "Unable to run command.",
                        "The autoplay command is only available for **YouTube** tracks.",
                        "WARN"
                    ),
                ],
            });

        autoPlayingQueue.repeatMode === QueueRepeatMode.AUTOPLAY
            ? autoPlayingQueue.setRepeatMode(QueueRepeatMode.OFF)
            : autoPlayingQueue.setRepeatMode(QueueRepeatMode.AUTOPLAY);

        return await channel.send({
            embeds: [
                Response(
                    `Autoplay is ${
                        autoPlayingQueue.repeatMode === QueueRepeatMode.AUTOPLAY ? "ON." : `OFF.`
                    }`,
                    autoPlayingQueue.repeatMode === QueueRepeatMode.AUTOPLAY
                        ? "Now playing nonstop"
                        : "",
                    "SUCCESS"
                ),
            ],
        });
    },
};
