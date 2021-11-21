import { Command } from "../../interfaces";
import { Response } from "../../models/";
import { MessageAttachment } from "discord.js";
import { api } from "../..";

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

        let requestString: string = "";

        if (!user2) {
            requestString = `/couple/?u1=${author.displayAvatarURL({
                format: "jpg",
                size: 256,
            })}&u2=${user1?.displayAvatarURL({ format: "jpg", size: 256 })}`;
        } else {
            requestString = `/couple/?u1=${user1?.displayAvatarURL({
                format: "jpg",
                size: 256,
            })}&u2=${user2?.displayAvatarURL({ format: "jpg", size: 256 })}`;
        }

        try {
            await api
                .get(encodeURI(requestString), { responseType: "arraybuffer" })
                .then((response) => {
                    return channel.send({
                        embeds: [
                            Response(
                                `${user2 ? user1!.user.username : author.username} :heart: ${
                                    user2 ? user2!.user.username : user1!.user.username
                                }`,
                                "",
                                "SUCCESS"
                            ).setImage(`attachment://image.png`),
                        ],
                        files: [new MessageAttachment(response.data, "image.png")],
                    });
                });
        } catch (error: any) {
            console.error(error.message);
            return channel.send("Error with GET request from bogue-image-processing server.");
        }
    },
};
