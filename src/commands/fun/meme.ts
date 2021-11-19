import Canvas, { loadImage, createCanvas } from "canvas";
import { MessageAttachment } from "discord.js";
import { Response } from "../../models";
import { Command } from "../../interfaces";

export const Meme: Command = {
    name: ["meme"],
    arguments: ["text", "top text / bottom text"],
    description: "Make a meme out of a image, use '/' to make bottom texts.",
    run: async (prefix, client, message, args) => {
        const { channel } = message;
        let attachment;

        const input = args!.join(" ");

        try {
            attachment = await (await message.fetchReference()).attachments;
            if (attachment.size === 0) throw new Error();
        } catch (error) {
            return channel.send({
                embeds: [Response("Error", "You need to reply to an image.", "FAIL")],
            });
        }

        const width = attachment.map((element) => element.width)[0]!;
        const height = attachment.map((element) => element.height)[0]!;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        await Canvas.registerFont("./Impact.ttf", { family: "Sans-Serif" });
        const image = await Canvas.loadImage(attachment.map((element) => element.url)[0]);

        ctx.drawImage(image, 0, 0, width, height);

        ctx.font = "bold 200px Impact";
        ctx.textAlign = "center";

        // Top Text
        ctx.textBaseline = "top";
        ctx.fillStyle = "white";
        ctx.fillText(
            input.includes("/") ? input.split("/")[0].trimEnd() : input,
            width / 2,
            0,
            width
        );
        ctx.fillStyle = "black";
        ctx.strokeText(
            input.includes("/") ? input.split("/")[0].trimEnd() : input,
            width / 2,
            0,
            width
        );

        // Bottom Text
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "white";
        ctx.fillText(
            input.includes("/") ? input.split("/")[1].trimStart() : "",
            width / 2,
            height,
            width
        );
        ctx.fillStyle = "black";
        ctx.strokeText(
            input.includes("/") ? input.split("/")[1].trimStart() : "",
            width / 2,
            height,
            width
        );

        return channel.send({
            files: [new MessageAttachment(canvas.toBuffer())],
        });
    },
};
