import { Command } from "../../interfaces";
import { Response } from "../../models/";
import { MessageAttachment } from "discord.js";
import Canvas, { createCanvas } from "canvas";

export const Couple: Command = {
    name: ["couple"],
    arguments: ["user 1", "user 1] [user 2"],
    description: "Connect the profile picture of two users.",
    run: async (prefix, client, message, args) => {
        const { channel, author, mentions } = message;
        if (!args![0])
            return channel.send({
                embeds: [Response("Error", "Please quote at least one user.", "FAIL")],
            });

        const user1 = mentions.members?.toJSON()[0];
        const user2 = mentions.members?.toJSON()[1];

        const canvas = createCanvas(512, 256);
        const ctx = canvas.getContext("2d");

        const user1Image = await Canvas.loadImage(
            user1!.displayAvatarURL({ format: "jpg", size: 256 })
        );

        if (!user2) {
            const authorImage = await Canvas.loadImage(
                author.displayAvatarURL({ format: "jpg", size: 256 })
            );

            ctx.drawImage(authorImage, 0, 0, authorImage.width, authorImage.height);
            ctx.drawImage(user1Image, user1Image.width, 0, user1Image.width, user1Image.height);

            const attach = new MessageAttachment(canvas.toBuffer(), "buffered.png");
            return await channel.send({
                embeds: [
                    Response(
                        `${author.username} :heart: ${user1!.displayName}`,
                        "",
                        "SUCCESS"
                    ).setImage(`attachment://buffered.png`),
                ],
                files: [attach],
            });
        } else {
            const user2Image = await Canvas.loadImage(
                user2!.displayAvatarURL({ format: "jpg", size: 256 })
            );
            ctx.drawImage(user1Image, 0, 0, user1Image.width, user1Image.height);
            ctx.drawImage(user2Image, user2Image.width, 0, user2Image.width, user2Image.height);

            const attach = new MessageAttachment(canvas.toBuffer(), "buffered.png");
            return await channel.send({
                embeds: [
                    Response(
                        `${user1!.displayName} :heart: ${user2!.displayName}`,
                        "",
                        "SUCCESS"
                    ).setImage(`attachment://buffered.png`),
                ],
                files: [attach],
            });
        }
    },
};
