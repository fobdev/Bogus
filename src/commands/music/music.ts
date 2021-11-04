import { Command } from "../../interfaces";
import { Response } from "../../models";
import { Queue } from "discord-player";

let queue: Queue;
export const Music: Command = {
    name: ["music", "m"],
    arguments: ["LINK", "leave"],
    description: "Discord Bot Music",
    run: async (client, message, args, player) => {
        const { channel, member, guild } = message;

        // Check if user is in the same voice channel as the bot
        if (guild?.me?.voice.channelId && member?.voice.channelId !== guild.me.voice.channelId)
            return channel.send({
                embeds: [
                    Response(
                        "Error trying to add music.",
                        "The user is not in the same voice channel as the bot.",
                        "FAIL"
                    ),
                ],
            });

        const userInput = args!.join(" ");

        // Player Commands
        if (args![0] === "skip" || args![0] === "s") {
            if (!queue || !queue.playing)
                return channel.send("No music is being played right now.");

            const success = queue.skip();

            if (success && queue.tracks.length > 0)
                return channel.send({
                    embeds: [
                        Response(
                            success ? "Track Skipped" : "Error Skipping Track",
                            success
                                ? `Now loading: **${queue.tracks[0].title}**...`
                                : "Error trying to skip track",
                            success ? "SUCCESS" : "FAIL"
                        ),
                    ],
                });
            else return;
        }

        if (args![0] === "queue" || args![0] === "q")
            if (queue && queue.tracks.length > 0) return channel.send(queue.toString());
            else return channel.send("There is nothing in the queue.");

        if (args![0] === "leave" || args![0] === "l")
            if (!queue || !queue.playing)
                return channel.send("I'm not even playing, what do you want from me D:");
            else {
                channel.send("Left the voice channel.");
                return queue.destroy();
            }

        // Video Search.
        const searchResult = await player!
            .search(userInput, { requestedBy: message.author })
            .catch((e) => console.error("Search error:", e));

        if (!searchResult || !searchResult.tracks.length)
            return channel.send({
                embeds: [Response("Search error", "Sorry, nothing was found", "FAIL")],
            });

        // Queue creation
        queue = player!.createQueue(guild!, {
            metadata: {
                channel: channel,
            },
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1 << 25,
                liveBuffer: 4000,
                dlChunkSize: 0,
            },
            bufferingTimeout: 5000,
        });

        // If no connection, connect to voide channel. Otherwise, add track to queue.
        try {
            if (!queue.connection)
                await queue
                    .connect(member!.voice.channel!)
                    .then(() => {
                        console.log("connected!");
                    })
                    .catch((e: any) => {
                        player!.deleteQueue(guild!.id);
                        console.log("Error connecting", e.message);
                    });
        } catch (error) {
            return channel.send({
                embeds: [
                    Response(
                        "Error trying to run the command.",
                        "I could not join the voice channel.",
                        "FAIL"
                    ),
                ],
            });
        }

        searchResult.playlist
            ? queue.addTracks(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0]);

        if (!queue.playing) queue.play();
    },
};
