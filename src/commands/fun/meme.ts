import { Collection, MessageAttachment, MessageEmbedImage } from "discord.js";
import { Response } from "../../models";
import { Command } from "../../interfaces";
import { api } from "../..";

export const Meme: Command = {
    name: ["meme"],
    arguments: ["text", "top text / bottom text"],
    description: "Make a meme out of a image, use '/' to make bottom texts.",
    run: async (prefix, client, message, args) => {
        const { channel } = message;
        const input = args!.join(" ");

        let attachment: MessageEmbedImage | Collection<string, MessageAttachment> | null;

        let width: number | undefined;
        let height: number | undefined;
        let imageURL;

        try {
            // check if the sent message contains a image
            attachment = await message.attachments;
            width = attachment!.map((element) => element.width)[0]!;
            height = attachment!.map((element) => element.height)[0]!;
            imageURL = attachment!.map((element) => element.url)[0]!;
            const isImage = attachment!
                .map((element) => element.contentType)![0]
                ?.includes("image");

            if (!imageURL || !isImage) throw new Error();
        } catch (error) {
            try {
                // check if the replied message have a embed with image, gets first one
                attachment = await (await message.fetchReference()).embeds[0].image;
                width = attachment!.width;
                height = attachment!.height;
                imageURL = attachment!.url;

                if (!imageURL) throw new Error();
            } catch (error) {
                try {
                    // checks if the replied message have a attachment image, gets first one
                    attachment = await (await message.fetchReference()).attachments;
                    width = attachment!.map((element) => element.width)[0]!;
                    height = attachment!.map((element) => element.height)[0]!;
                    imageURL = attachment!.map((element) => element.url)[0]!;
                    const isImage = attachment!
                        .map((element) => element.contentType)![0]
                        ?.includes("image");

                    if (attachment.size === 0 || !imageURL || !isImage) throw new Error();
                } catch (error) {
                    return channel.send({
                        embeds: [
                            Response(
                                "Error",
                                "You need to reply to or send a image or gif.",
                                "FAIL"
                            ),
                        ],
                    });
                }
            }
        }

        // input setting
        let topText = input.includes("/") ? input.split("/")[0].trimEnd() : input;
        let bottomText = input.includes("/") ? input.split("/")[1].trimStart() : " ";

        try {
            await api
                .get(
                    encodeURI(
                        `/meme/?top=${topText ? topText : " "}&bottom=${bottomText}&url=${imageURL}`
                    ),
                    {
                        responseType: "arraybuffer",
                    }
                )
                .then((response) => {
                    return channel.send({
                        files: [new MessageAttachment(response.data)],
                    });
                });
        } catch (error: any) {
            console.error(error.message);
            return channel.send(
                `Error with GET request from bogue-image-processing server: ${error.message}`
            );
        }
    },
};
