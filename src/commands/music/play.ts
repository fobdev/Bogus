import { Command } from "../../interfaces";
import { Response } from "../../models";
import { Queue } from "discord-player";

let queue: Queue;
export const Play: Command = {
    name: ["play", "p"],
    arguments: ["search", "Youtube / Spotify / SoundCloud"],
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

        if (!message.member?.voice.channel)
            return channel.send({
                embeds: [Response("Error", "You need to enter a voice channel first.", "WARN")],
            });

        const userInput = args!.join(" ");

        // Video Search
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
