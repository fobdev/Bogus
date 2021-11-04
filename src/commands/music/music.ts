import { Command } from "../../interfaces";
import { Response } from "../../models";
import { Queue } from "discord-player";
import {
    BaseMessageComponentOptions,
    ButtonInteraction,
    MessageActionRow,
    MessageButton,
    MessageOptions,
    MessagePayload,
} from "discord.js";
import ms from "ms";

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

        if (!message.member?.voice.channel)
            return channel.send({
                embeds: [Response("Error", "You need to enter a voice channel first.", "WARN")],
            });

        const userInput = args!.join(" ");

        /** Player Commands */

        // Skip to next track
        if (args![0] === "skip" || args![0] === "s") {
            const skippingQueue = player?.getQueue(guild!.id);
            if (!skippingQueue || !skippingQueue.playing)
                return channel.send({
                    embeds: [
                        Response(
                            "Nothing is being played.",
                            "You need to play something first.",
                            "WARN"
                        ),
                    ],
                });

            let success;
            success = skippingQueue!.skip();
            if (success && skippingQueue.tracks.length > 0)
                return channel.send({
                    embeds: [
                        Response(
                            success ? "Track Skipped" : "Error Skipping Track",
                            success
                                ? `Now loading: **${skippingQueue.tracks[0].title}**...`
                                : "Error trying to skip track",
                            success ? "SUCCESS" : "FAIL"
                        ),
                    ],
                });
            else return;
        }

        // List all tracks remaining
        if (args![0] === "queue" || args![0] === "q") {
            const listingQueue = player?.getQueue(guild!.id);
            if (listingQueue && listingQueue.tracks.length > 0) {
                let jsonQueue = listingQueue.toJSON();
                let queueStringArray: Array<string> = [];
                const titleMaxSize = 30;
                jsonQueue.tracks.forEach((track, index) => {
                    return queueStringArray.push(
                        `[${index + 1 <= 9 ? `0${index + 1}` : `${index + 1}`}] ${
                            track.title.length > titleMaxSize
                                ? `${track.title.slice(0, titleMaxSize)}...`
                                : `${track.title}`
                        } - ${track.duration}`
                    );
                });

                const pageSize = 15;
                let page = 0;
                let responseQueue = Response(
                    `Queue of **${listingQueue.guild.name}**`,
                    "",
                    "OTHER",
                    "PURPLE"
                )
                    .setFooter(`Total queue time: ${ms(listingQueue.totalTime, { long: true })}`)
                    .setThumbnail(listingQueue.tracks[0].thumbnail)
                    .addField(
                        "Coming next:",
                        "```" +
                            `[${listingQueue.tracks[0].title}] by ${listingQueue.tracks[0].author} - ${listingQueue.tracks[0].duration}` +
                            "```"
                    )
                    .addField(
                        "Tracks:",
                        "```md\n" +
                            `${queueStringArray.slice(1, pageSize + page).join("\n")}` +
                            "```"
                    );

                let sendObject: MessageOptions = {
                    embeds: [responseQueue],
                };

                if (queueStringArray.length > pageSize)
                    sendObject.components = [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setCustomId("previous")
                                .setLabel("Scroll Up")
                                .setStyle("SECONDARY"),
                            new MessageButton()
                                .setCustomId("next")
                                .setLabel("Scroll Down")
                                .setStyle("SECONDARY")
                        ),
                    ];

                return channel.send(sendObject).then((msg) => {
                    client.on("interactionCreate", async (interaction) => {
                        if (interaction.isButton()) {
                            await interaction.deferUpdate();
                            switch (interaction.customId) {
                                case "next":
                                    if (page < 1 + queueStringArray.length / pageSize) page++;
                                    break;
                                case "previous":
                                    if (page !== 0) page--;
                                    break;
                                default:
                                    break;
                            }

                            let responseQueue = Response(
                                `Queue of **${listingQueue.guild.name}**`,
                                "",
                                "OTHER",
                                "PURPLE"
                            )
                                .setFooter(
                                    `Total queue time: ${ms(listingQueue.totalTime, {
                                        long: true,
                                    })}`
                                )
                                .setThumbnail(listingQueue.tracks[0].thumbnail)
                                .addField(
                                    "Coming next:",
                                    "```" +
                                        `[${listingQueue.tracks[0].title}] by ${listingQueue.tracks[0].author} - ${listingQueue.tracks[0].duration}` +
                                        "```"
                                )
                                .addField(
                                    "Tracks:",
                                    "```md\n" +
                                        `${queueStringArray
                                            .slice(1 + page * 5, pageSize + page * 5)
                                            .join("\n")}` +
                                        "```"
                                );

                            msg.edit({
                                embeds: [responseQueue],
                            });
                        }
                    });
                });
            }
            return channel.send("There is no queue in this server.");
        }

        // Leave voice channel
        if (args![0] === "leave" || args![0] === "l") {
            const leavingQueue = player?.getQueue(guild!.id);
            if (!leavingQueue || !leavingQueue.playing)
                return channel.send("I'm not even playing, what do you want from me D:");
            else {
                channel.send("Left the voice channel.");
                return leavingQueue.destroy();
            }
        }

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
