import Canvas, { createCanvas } from "canvas";
import { Collection, MessageAttachment, MessageEmbedImage } from "discord.js";
import { Response } from "../../models";
import { Command } from "../../interfaces";

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

        const canvas = createCanvas(width!, height!);
        const ctx = canvas.getContext("2d");

        let image;
        try {
            image = await Canvas.loadImage(imageURL!);
        } catch (error) {
            return channel.send({
                embeds: [Response("Error", "The file type is not supported.", "FAIL")],
            });
        }

        const japanese: RegExp =
            /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;

        ctx.drawImage(image, 0, 0, width, height);

        Canvas.registerFont("./src/fonts/Impact.ttf", { family: "Sans-Serif" });
        Canvas.registerFont("./src/fonts/NotoSansJP-Bold.otf", { family: "Sans-Serif" });

        ctx.font = `bold ${width! / 10}px ${input.match(japanese) ? "NotoSansJP-Bold" : "Impact"}`;
        ctx.textAlign = "center";

        // Top Text
        ctx.textBaseline = "top";
        ctx.fillStyle = "white";
        ctx.fillText(
            input.includes("/") ? input.split("/")[0].trimEnd() : input,
            width! / 2,
            0,
            width
        );
        ctx.fillStyle = "black";
        ctx.strokeText(
            input.includes("/") ? input.split("/")[0].trimEnd() : input,
            width! / 2,
            0,
            width
        );

        // Bottom Text
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "white";
        ctx.fillText(
            input.includes("/") ? input.split("/")[1].trimStart() : "",
            width! / 2,
            height!,
            width
        );
        ctx.fillStyle = "black";
        ctx.strokeText(
            input.includes("/") ? input.split("/")[1].trimStart() : "",
            width! / 2,
            height!,
            width
        );

        return channel.send({
            files: [new MessageAttachment(canvas.toBuffer())],
        });
    },
};
