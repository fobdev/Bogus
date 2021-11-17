import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Invite: Command = {
    name: ["invite"],
    description: "Generate a invite URL for the bot",
    run: async (prefix, client, message, args) => {
        let { channel } = message;

        let res = (link: string) =>
            Response("Add me to another servers!", `${link}`, "SUCCESS").setThumbnail(
                client.user?.avatarURL({ size: 2048 })!
            );

        if (args![0] === "simple") {
            return channel.send({
                embeds: [
                    res(
                        client.generateInvite({
                            scopes: ["bot", "applications.commands"],
                        })
                    ),
                ],
            });
        } else {
            return channel.send({
                embeds: [
                    res(
                        client.generateInvite({
                            scopes: ["bot", "applications.commands"],
                            permissions: ["ADMINISTRATOR"],
                        })
                    ).addField(
                        "By adding me via this link, I will have Administrator Permissions.",
                        "```" +
                            `${prefix}invite simple` +
                            "```" +
                            " For a link without Admin permissions."
                    ),
                ],
            });
        }
    },
};
