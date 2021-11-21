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

        let userInput: string = message.content.split(" ").slice(1).join(" ");

        // fix weird bug where search dont get youtube video ids
        const parseYtLink = (url: string) => {
            let regExp =
                /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            let match = url.match(regExp);
            return match && match[7].length == 11 ? match[7] : false;
        };

        // Video Search
        const searchResult = await player!
            .search(userInput, {
                requestedBy: message.author,
                searchEngine: parseYtLink(userInput) ? QueryType.YOUTUBE_SEARCH : QueryType.AUTO,
            })
            .catch((e) => console.error("Search error:", e));

        if (!searchResult || !searchResult.tracks.length)
            return channel.send({
                embeds: [Response("Search error", "Sorry, nothing was found", "FAIL")],
            });

        // Queue creation
        let queue: Queue;
        queue = player!.createQueue(guild!, {
            metadata: {
                channel: channel,
            },
            async onBeforeCreateStream(track, source, _queue) {
                // spotify searching to youtube
                if (track.url.includes("spotify"))
                    return await playdl
                        .search(`${track.title} ${track.author}`, {
                            limit: 1,
                            source: { youtube: "video" },
                        })
                        .then(async (results) => {
                            try {
                                return (await playdl.stream(results[0].url)).stream;
                            } catch (error: any) {
                                console.error(error.message);
                                return (await playdl.stream(results[0].url)).stream;
                            }
                        });

                try {
                    return (await playdl.stream(track.url)).stream;
                } catch (error: any) {
                    console.error(error.message);
                    return (await playdl.stream(track.url)).stream;
                }
            },
        });

        // If no connection, connect to voide channel. Otherwise, add track to queue.
        try {
            if (!queue.connection)
                await queue
                    .connect(member!.voice.channel!)
                    .then(() => {
                        console.log(
                            `[CONNECTION] Connected to voice channel [${queue.connection.channel.name}] at [${queue.guild.name}].`
                        );
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

        // enforces the search to give the exact same link as the input
        let enforcedTrack: Track = searchResult.tracks[0];
        for (let index = 0; index < searchResult.tracks.length; index++) {
            if (searchResult.tracks[index].url === userInput) {
                console.log("enforced search until layer " + index);
                enforcedTrack = searchResult.tracks[index];
                break;
            }
        }

        searchResult.playlist
            ? queue.addTracks(searchResult.tracks)
            : queue.addTrack(enforcedTrack);

        if (!queue.playing) queue.play();
    },
};
