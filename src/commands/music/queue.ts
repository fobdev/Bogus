import { Command } from "../../interfaces";
import { Response } from "../../models";
import { MessageActionRow, MessageButton } from "discord.js";
import { MessageOptions } from "discord.js";
import ms from "ms";

export const Queue: Command = {
    name: ["queue", "q"],
    description: "Display all the current tracks in the server queue.",
    run: async (prefix, client, message, args, player) => {
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
            const displayButtons = queueStringArray.length > pageSize;
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
                    )} ${
                        displayButtons
                            ? "\nThe buttons in this message will be removed in 30s if without interactions."
                            : ""
                    }`
                )
                .setThumbnail(nextInQueue.thumbnail)
                .addField(
                    "Coming next:",
                    "```" + `[${nextInQueue.title}] - ${nextInQueue.duration}` + "```"
                )
                .addField(
                    "Tracks",
                    "```\n" + `${queueStringArray.slice(1, pageSize + page).join("\n")}` + "```"
                );

            let sendObject: MessageOptions = {
                embeds: [responseQueue],
            };

            const prevButton = new MessageButton()
                .setCustomId(Math.random().toString())
                .setLabel("Scroll Up")
                .setStyle("SECONDARY");

            const nextButton = new MessageButton()
                .setCustomId(Math.random().toString())
                .setLabel("Scroll Down")
                .setStyle("SECONDARY");

            if (displayButtons)
                sendObject.components = [
                    new MessageActionRow().addComponents(prevButton, nextButton),
                ];

            return channel.send(sendObject).then((msg) => {
                const buttonsCollector = msg.channel.createMessageComponentCollector({
                    filter: (i) =>
                        (i.customId === prevButton.customId ||
                            i.customId === nextButton.customId) &&
                        i.user.id === message.author.id,
                    idle: ms("30s"),
                });

                buttonsCollector.on("end", () => {
                    sendObject.components = [];
                    sendObject.embeds![0].footer!.text = `Queue size: ${
                        queueStringArray.length
                    } tracks | Total queue time: ${ms(listingQueue.totalTime, { long: true })}`;
                    msg.edit(sendObject);
                });

                buttonsCollector.on("collect", (interaction) => {
                    interaction.deferUpdate();

                    let slicedArray = queueStringArray.slice(
                        page * scrollSize,
                        pageSize + page * scrollSize
                    );

                    switch (interaction.customId) {
                        case prevButton.customId:
                            if (page !== 0) page--;
                            break;
                        case nextButton.customId:
                            if (
                                !slicedArray[slicedArray.length - 1].startsWith(
                                    `[${queueStringArray.length}]`
                                )
                            )
                                page++;
                            break;
                        default:
                            return;
                    }

                    msg.edit({
                        embeds: [
                            Response(
                                responseQueue.title!,
                                responseQueue.description!,
                                "OTHER",
                                "PURPLE"
                            )
                                .setThumbnail(responseQueue.thumbnail!.url)
                                .addField(
                                    responseQueue.fields[0]!.name,
                                    responseQueue.fields[0]!.value
                                )
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
                                .setFooter(responseQueue.footer?.text!),
                        ],
                        components: [new MessageActionRow().addComponents(prevButton, nextButton)],
                    });
                });
            });
        }
        return channel.send({
            embeds: [
                Response(
                    "No queue in the server",
                    "Try using``" +
                        prefix +
                        "play`` with a Spotify or Youtube playlist to create a queue for this server.",
                    "WARN"
                ),
            ],
        });
    },
};
