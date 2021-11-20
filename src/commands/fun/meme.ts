import { BufferResolvable, Collection, MessageAttachment, MessageEmbedImage } from "discord.js";
import { Response } from "../../models";
import { Command } from "../../interfaces";
import axios from "axios";

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
            attachment = await (await message.fetchReference()).embeds[0].image;
            width = attachment!.width;
            height = attachment!.height;
            imageURL = attachment?.url;
        } catch (error) {
            try {
                attachment = await (await message.fetchReference()).attachments;
                width = attachment!.map((element) => element.width)[0]!;
                height = attachment!.map((element) => element.height)[0]!;
                imageURL = attachment!.map((element) => element.url)[0];

                if (attachment.size === 0) throw new Error();
            } catch (error) {
                return channel.send({
                    embeds: [Response("Error", "You need to reply to an image.", "FAIL")],
                });
            }
        }

        // Gets from the image processing server
        const api = axios.create({ baseURL: "https://bogus-image-processing.herokuapp.com/" });

        // input setting
        let topText = input.includes("/") ? input.split("/")[0].trimEnd() : input;
        let bottomText = input.includes("/") ? input.split("/")[1].trimStart() : " ";

        try {
            await api
                .get(`/${topText ? topText : " "}/${bottomText}/${imageURL}`, {
                    responseType: "arraybuffer",
                })
                .then((response) => {
                    return channel.send({
                        files: [new MessageAttachment(response.data)],
                    });
                });
        } catch (error) {
            console.error(error);
            return channel.send("Error with GET request from bogue-image-processing server.");
        }
    },
};
