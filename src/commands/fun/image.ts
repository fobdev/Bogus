import { Command } from "../../interfaces";
import GoogleImages from "google-images";
import { MessageActionRow, MessageButton, MessageOptions } from "discord.js";
import { Response } from "../../models";
import ms from "ms";

export const ImageSearch: Command = {
    name: ["image"],
    arguments: ["query"],
    description: "Search for images using the Google API",
    run: async (prefix, client, message, args) => {
        const { channel } = message;
        const searchClient = new GoogleImages(
            process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID!,
            process.env.GOOGLE_API_KEY!
        );

        if (args?.length === 0)
            return channel.send({
                embeds: [Response("Error", "You need to search for something", "FAIL")],
            });

        const prevButton = new MessageButton()
            .setCustomId(Math.random().toString())
            .setLabel("Previous")
            .setStyle("SECONDARY");

        const nextButton = new MessageButton()
            .setCustomId(Math.random().toString())
            .setLabel("Next")
            .setStyle("SECONDARY");

        await searchClient.search(args!.join(" ")).then((images) => {
            let iterator = 0;

            if (images.length === 0) {
                channel.send({
                    embeds: [
                        Response("Nothing was found.", "Try searching for something else.", "WARN"),
                    ],
                });
                return;
            }

            return channel
                .send({
                    components: [new MessageActionRow().addComponents(prevButton, nextButton)],
                    embeds: [
                        Response(
                            `Results for ${args?.join(" ")} ( ${iterator + 1} / ${images.length} )`,
                            "",
                            "SUCCESS"
                        ).setImage(images[iterator].url),
                    ],
                })
                .then((msg) => {
                    const buttonsCollector = msg.channel.createMessageComponentCollector({
                        filter: (i) =>
                            (i.customId === prevButton.customId ||
                                i.customId === nextButton.customId) &&
                            i.user.id === message.author.id,
                        idle: ms("30s"),
                    });

                    buttonsCollector.on("end", () => {
                        msg.edit({
                            embeds: [
                                Response(
                                    `Results for ${args?.join(" ")} ( ${iterator + 1} / ${
                                        images.length
                                    } )`,
                                    "",
                                    "SUCCESS"
                                ).setImage(images[iterator].url),
                            ],
                            components: [],
                        });
                    });

                    buttonsCollector.on("collect", (interaction) => {
                        interaction.deferUpdate();

                        switch (interaction.customId) {
                            case prevButton.customId:
                                iterator--;
                                if (iterator < 0) iterator = images.length - 1;
                                break;
                            case nextButton.customId:
                                iterator++;
                                if (iterator > images.length - 1) iterator = 0;
                                break;
                            default:
                                return;
                        }

                        msg.edit({
                            components: [
                                new MessageActionRow().addComponents(prevButton, nextButton),
                            ],
                            embeds: [
                                Response(
                                    `Results for ${args?.join(" ")} ( ${iterator + 1} / ${
                                        images.length
                                    } )`,
                                    "",
                                    "SUCCESS"
                                ).setImage(images[iterator].url),
                            ],
                        });
                    });
                });
        });
    },
};
