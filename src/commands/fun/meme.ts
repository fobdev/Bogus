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

        const japanese: RegExp =
            /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        let image;

        try {
            image = await Canvas.loadImage(attachment.map((element) => element.url)[0]);
        } catch (error) {
            return channel.send({
                embeds: [Response("Error", "The file type is not supported.", "FAIL")],
            });
        }

        ctx.drawImage(image, 0, 0, width, height);

        await Canvas.registerFont("./Impact.ttf", { family: "Sans-Serif" });
        await Canvas.registerFont("./NotoSansJP-Bold.otf", { family: "Sans-Serif" });

        ctx.font = `bold ${width / 10}px ${input.match(japanese) ? "NotoSansJP-Bold" : "Impact"}`;
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
