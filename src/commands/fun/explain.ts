import { MessageAttachment } from "discord.js";
import { Response } from "../../models";
import { Command } from "../../interfaces";
import { unlink } from "fs/promises";
import Jimp from "jimp";

export const Explain: Command = {
    name: ["explain"],
    arguments: ["text"],
    description: "Robert Downey Jr.",
    run: async (prefix, client, message, args) => {
        const { channel } = message;

        const source = "./src/images/rdj.png";
        const outsource = `${message.id}.png`;
        const reference = await message.fetchReference().catch(() => null);
        const caption = args!.length > 0 ? args?.join(" ") : reference ? reference.toString() : "";
        if (args?.length === 0 && !reference)
            return channel.send({
                embeds: [
                    Response("Error", "You need to input a text or reply to a message.", "FAIL"),
                ],
            });

        let loadedImage: Jimp;
        await Jimp.read(source)
            .then((image) => {
                loadedImage = image;
                if (caption!.length > 150) return Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
                return Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
            })
            .then((font) => {
                if (caption!.length < 90)
                    return loadedImage.print(
                        font,
                        loadedImage.getWidth() / 2 - 1000,
                        loadedImage.getHeight() / 2 - 400,
                        {
                            text: caption,
                            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                        },
                        1200
                    );

                return loadedImage.print(font, 100, 50, caption, 1200);
            })
            .then((image) => {
                return image.write(outsource, async () => {
                    return channel
                        .send({ files: [new MessageAttachment(`./${outsource}`)] })
                        .then(() => {
                            return unlink(`./${outsource}`).catch((err) => {
                                return console.error(
                                    `[FILE ERROR] Error in deleting file ${outsource}: ${err}`
                                );
                            });
                        });
                });
            });
    },
};
