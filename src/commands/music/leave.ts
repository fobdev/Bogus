import { QueueRepeatMode } from "discord-player";
import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Leave: Command = {
    name: ["leave", "l"],
    description: "Leaves the voice channel and delete the server queue.",
    run: async (prefix, client, message, args, player) => {
        const { member, channel, guild } = message;
        const leavingQueue = player?.getQueue(guild!.id);

        if (!leavingQueue)
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

        leavingQueue.clear();
        leavingQueue.setRepeatMode(QueueRepeatMode.OFF);
        return leavingQueue.stop();
    },
};
