import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Earrape: Command = {
    name: ["earrape"],
    description: "Increase the volume of the player by a lot, use it again to disable it.",
    run: async (prefix, client, message, args, player) => {
        const { member, guild, channel } = message;
        const explodingQueue = player?.getQueue(guild!.id);
        const earrapeVolume = 100000;
        const defaultVolume = 100;

        if (!explodingQueue || !explodingQueue.playing)
            return channel.send({
                embeds: [Response("Error", "There is nothing playing right now.", "FAIL")],
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

        explodingQueue.volume === 100
            ? await explodingQueue.setVolume(earrapeVolume)
            : await explodingQueue.setVolume(defaultVolume);

        return channel.send({
            embeds: [
                Response(
                    `Earrape is now ${
                        explodingQueue.volume === defaultVolume ? "Disabled" : "Enabled"
                    }`,
                    explodingQueue.volume === earrapeVolume
                        ? `Use ${prefix}earrape to disable it.`
                        : "",
                    "OTHER",
                    "PURPLE"
                ),
            ],
        });
    },
};
