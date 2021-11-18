import { Command } from "../../interfaces";
import { Response } from "../../models/";
import { MessageAttachment } from "discord.js";
import { unlink } from "fs/promises";
import mergeimg from "merge-img";

export const Couple: Command = {
    name: ["couple"],
    description: "Connect the profile picture of two users.",
    run: async (prefix, client, message, args) => {
        const { channel, author, mentions } = message;
        const fname = `couple_${message.id}.png`;

        const user1 = mentions.members?.first();
        const user2 = mentions.members?.last();

        if (!user1 && !user2)
            return channel.send({
                embeds: [Response("Error", "Please quote at least one user.", "FAIL")],
            });

        try {
            await mergeimg([
                user1!.displayAvatarURL({ format: "jpg", size: 256 }),
                user2!.displayAvatarURL({ format: "jpg", size: 256 }),
            ]).then(async (img) => {
                console.log(
                    `[FILE CREATE] Couple image generated sucessfully as [${fname}] locally.`
                );

                img.write(fname, async () => {
                    // write
                    await channel.send({
                        embeds: [
                            Response(
                                `${user1?.displayName} :heart: ${user2?.displayName}`,
                                "",
                                "SUCCESS"
                            ).setImage(`attachment://${fname}`),
                        ],
                        files: [new MessageAttachment(`./${fname}`)],
                    });

                    // delete
                    return unlink(`./${fname}`).catch((err) => {
                        if (err)
                            return console.log(
                                `[FILE ERROR] Error in deleting file ${fname}: ${err}`
                            );
                    });
                });
            });
        } catch (error) {
            console.error(error);
        }
    },
};
