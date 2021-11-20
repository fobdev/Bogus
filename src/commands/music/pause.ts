import { Command } from "../../interfaces";
import { Response } from "../../models";
import { Resume } from "./resume";

export const Pause: Command = {
    name: ["pause"],
    description: "Pauses the current playing track.",
    run: async (prefix, client, message, args, player) => {
        const { member, guild, channel } = message;

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

        const pausingQueue = player?.getQueue(guild!.id);

        if (!pausingQueue || !pausingQueue.playing)
            return channel.send({
                embeds: [
                    Response(
                        "Nothing is playing right now.",
                        "Please play something before using this command",
                        "WARN"
                    ),
                ],
            });

        const paused = pausingQueue.setPaused(true);
        return channel.send({
            embeds: [
                Response(
                    paused ? "Song Paused" : "Failed",
                    paused
                        ? "Use ``" + `${prefix}${Resume.name[0]}` + "`` to resume it."
                        : "Looks like nothing is playing.",
                    paused ? "WARN" : "FAIL"
                ),
            ],
        });
    },
};
