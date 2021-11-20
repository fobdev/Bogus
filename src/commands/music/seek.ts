import { Command } from "../../interfaces";
import { Response } from "../../models";
import parse from "parse-duration";
import prettyms from "pretty-ms";

export const Seek: Command = {
    name: ["seek"],
    arguments: ["time (0h0m0s / 0m0s / 0s)"],
    description:
        "Go to a specified time in the current track.\n**Example input: 1h20m30s or 10m5s**",
    run: async (prefix, client, message, args, player) => {
        const { member, guild, channel } = message;
        const seekingQueue = player?.getQueue(guild!.id);

        if (!seekingQueue || !seekingQueue.playing)
            return channel.send({
                embeds: [
                    Response(
                        "Nothing is playing right now.",
                        "Please play something before using this command",
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

        if (args?.length === 0)
            return channel.send({
                embeds: [
                    Response(
                        "Error",
                        "You need to give a time.\nExample inputs:\n30m10s\n1h10m5s\n30s",
                        "FAIL"
                    ),
                ],
            });

        const seektime = parse(args![0], "millisecond");

        if (seektime >= seekingQueue.current.durationMS || seektime <= 0)
            return channel.send({
                embeds: [
                    Response(
                        "Invalid time input",
                        `Use values between 0s and ${prettyms(
                            seekingQueue.current.durationMS
                        ).trim()}`,
                        "FAIL"
                    ),
                ],
            });

        return await channel
            .send({
                embeds: [
                    Response(
                        "Seeking...",
                        `Jumping to ${prettyms(seektime, {
                            colonNotation: true,
                        })} in the track.`,
                        "OTHER",
                        "PURPLE"
                    ).setFooter(
                        `Use [${prefix}help seek] for information about the format of this command.`
                    ),
                ],
            })
            .then(() => {
                return seekingQueue.seek(seektime);
            });
    },
};
