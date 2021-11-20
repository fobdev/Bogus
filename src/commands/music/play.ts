import { Command } from "../../interfaces";
import { Response } from "../../models";
import { QueryType, Queue, Track } from "discord-player";
import * as playdl from "play-dl";

export const Play: Command = {
    name: ["play", "p"],
    arguments: ["search", "Youtube / Spotify / SoundCloud"],
    description:
        "Search for a track or playlist and then play it. Can be used with Spotify, YouTube and SoundCloud.",
    run: async (prefix, client, message, args, player) => {
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

        let userInput: any = message.content.split(" ").slice(1).join(" ");

        // fix weird bug where search dont get youtube video ids
        const parseYtLink = (url: string) => {
            let regExp =
                /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            let match = url.match(regExp);
            return match && match[7].length == 11 ? match[7] : false;
        };

        if (parseYtLink(userInput))
            userInput = await (
                await playdl.search(userInput, { limit: 1, source: { youtube: "video" } })
            ).map((element) => `${element.title} ${element.channel}`)[0];

        // Video Search
        const searchResult = await player!
            .search(userInput, {
                requestedBy: message.author,
            })
            .catch((e) => console.error("Search error:", e));

        if (!searchResult || !searchResult.tracks.length)
            return channel.send({
                embeds: [Response("Search error", "Sorry, nothing was found", "FAIL")],
            });

        // Queue creation
        let queue: Queue;
        try {
            queue = player!.createQueue(guild!, {
                initialVolume: 100,
                metadata: {
                    channel: channel,
                },
                async onBeforeCreateStream(track, source, _queue) {
                    const searched = await playdl.search(`${track.title} ${track.author}`, {
                        limit: 1,
                        source: { youtube: "video" },
                    });

                    return await (
                        await playdl.stream(searched[0].url!)
                    ).stream;
                },
            });
        } catch (error) {
            console.error(error);
            return channel.send("Please try again.");
        }

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
