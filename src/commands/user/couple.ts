import { Command } from "../../interfaces";
import { Response } from "../../models/";
import {
    DMChannel,
    MessageAttachment,
    NewsChannel,
    PartialDMChannel,
    TextChannel,
    ThreadChannel,
    User,
} from "discord.js";
import { unlink } from "fs/promises";
import mergeimg from "merge-img";

const writeAndDelete = (
    channel: TextChannel | PartialDMChannel | DMChannel | NewsChannel | ThreadChannel,
    image: any,
    filename: string,
    user1: User | undefined,
    user2: User | undefined
) => {
    // write
    image.write(filename, async () => {
        await channel.send({
            embeds: [
                Response(`${user1!.username} :heart: ${user2!.username}`, "", "SUCCESS").setImage(
                    `attachment://${filename}`
                ),
            ],
            files: [new MessageAttachment(`./${filename}`)],
        });

        // delete
        return unlink(`./${filename}`).catch((err) => {
            if (err) return console.log(`[FILE ERROR] Error in deleting file ${filename}: ${err}`);
        });
    });
};

export const Couple: Command = {
    name: ["couple"],
    arguments: ["user 1", "user 1] [user 2"],
    description: "Connect the profile picture of two users.",
    run: async (prefix, client, message, args) => {
        const { channel, author, mentions } = message;
        const fname = `couple_${message.id}.png`;

        if (!args![0])
            return channel.send({
                embeds: [Response("Error", "Please quote at least one user.", "FAIL")],
            });

        const user1 = mentions.members?.toJSON()[0];
        const user2 = mentions.members?.toJSON()[1];

        if (!user2)
            try {
                return await mergeimg([
                    author.displayAvatarURL({ format: "jpg", size: 256 }),
                    user1!.displayAvatarURL({ format: "jpg", size: 256 }),
                ]).then((img) => {
                    writeAndDelete(channel, img, fname, author, user1?.user);
                });
            } catch (error) {
                console.error(error);
            }

        try {
            return await mergeimg([
                user1!.displayAvatarURL({ format: "jpg", size: 256 }),
                user2!.displayAvatarURL({ format: "jpg", size: 256 }),
            ]).then(async (img) => {
                writeAndDelete(channel, img, fname, user1?.user, user2?.user);
            });
        } catch (error) {
            console.error(error);
        }
    },
};
