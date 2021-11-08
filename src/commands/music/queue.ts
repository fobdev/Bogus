import { Command } from "../../interfaces";
import { Response } from "../../models";
import ms from "ms";
import { MessageActionRow, MessageButton } from "discord.js";
import { MessageOptions } from "discord.js";
import botconfig from "../../botconfig.json";

export const Queue: Command = {
    name: ["queue", "q"],
    description: "Display all the current tracks in the server queue.",
    run: async (client, message, args, player) => {
        const { guild, channel } = message;

        const listingQueue = player?.getQueue(guild!.id);
        if (listingQueue && listingQueue.tracks.length > 0) {
            const nextInQueue = listingQueue.tracks[0];
            const jsonQueue = listingQueue.toJSON();
            const titleMaxSize = 30;
            const scrollSize = 6;

            let queueStringArray: Array<string> = [];
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
                .setFooter(
                    `Queue size: ${queueStringArray.length} tracks | Total queue time: ${ms(
                        listingQueue.totalTime,
                        { long: true }
                    )}`
                )
                .setThumbnail(nextInQueue.thumbnail)
                .addField(
                    "Coming next:",
                    "```" + `[${nextInQueue.title}] - ${nextInQueue.duration}` + "```"
                );

            if (queueStringArray.length > 1)
                responseQueue.addField(
                    "Tracks:",
                    "```md\n" + `${queueStringArray.slice(1, pageSize + page).join("\n")}` + "```"
                );

            let sendObject: MessageOptions = {
                embeds: [responseQueue],
            };

            const randPrev = Math.random();
            const randNext = Math.random();

            if (queueStringArray.length > pageSize)
                sendObject.components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId(randPrev.toString())
                            .setLabel("Scroll Up")
                            .setStyle("SECONDARY"),
                        new MessageButton()
                            .setCustomId(randNext.toString())
                            .setLabel("Scroll Down")
                            .setStyle("SECONDARY")
                    ),
                ];

            return channel.send(sendObject).then((msg) => {
                    let slicedArray = queueStringArray.slice(
                        page * scrollSize,
                        pageSize + page * scrollSize
                    );
                            case randNext.toString():
                                {
                                    await interaction.deferUpdate();
                                    if (page < 1 + queueStringArray.length / pageSize) page++;
                                }
                                break;
                            case randPrev.toString():
                                {
                                    await interaction.deferUpdate();
                                    if (page !== 0) page--;
                                }
                                break;
                            default:
                                return;
                        }

                        let responseQueue = Response(
                            `Queue of **${listingQueue.guild.name}**`,
                            "",
                            "OTHER",
                            "PURPLE"
                        )
                            .setFooter(
                                `Queue size: ${
                                    queueStringArray.length
                                } tracks | Total queue time: ${ms(
                                    listingQueue.totalTime ? listingQueue.totalTime : 0,
                                    {
                                        long: true,
                                    }
                                )}`
                            )
                            .setThumbnail(nextInQueue.thumbnail)
                            .addField(
                                .addField(
                                    responseQueue.fields[1]!.name,
                                    "```\n" +
                                        `${queueStringArray
                                            .slice(
                                                1 + page * scrollSize,
                                                pageSize + page * scrollSize
                                            )
                                            .join("\n")}` +
                                        "```"
                                )
                    }
                });
            });
        }
        return channel.send({
            embeds: [
                Response(
                    "No queue in the server",
                    "Try using``" +
                        botconfig.prefix +
                        "play`` with a Spotify or Youtube playlist to create a queue for this server.",
                    "WARN"
                ),
            ],
        });
    },
};
