import { MessageAttachment } from "discord.js";

import { Command } from "../../interfaces";
import Jimp from "jimp";
import { unlink } from "fs/promises";

export const Explain: Command = {
    name: ["explain"],
    description: "Robert Downey Jr.",
    run: async (prefix, client, message) => {
        const { channel } = message;

        const source = "./src/images/rdj.png";
        const outsource = `${message.id}.png`;
        const caption = await message.fetchReference();

        let loadedImage: Jimp;

        await Jimp.read(source)
            .then((image) => {
                loadedImage = image;
                return Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
            })
            .then((font) => {
                return loadedImage.print(font, 100, 50, caption, 1200);
            })
            .then((image) => {
                return image.write(outsource, async () => {
                    return channel
                        .send({ files: [new MessageAttachment(`./${outsource}`)] })
                        .then(() => {
                            return unlink(`./${outsource}`).catch((err) => {
                                if (err)
                                    return console.log(
                                        `[FILE ERROR] Error in deleting file ${outsource}: ${err}`
                                    );
                            });
                        });
                });
            });
    },
};
