import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import { onError } from "../../events";
import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Clear: Command = {
    name: ["clear", "cl"],
    arguments: ["amount"],
    description: "Clear a specific amount of messages from the channel",
    run: async (prefix, client, message, args) => {
        let { channel } = message;
        let amount: number;

        if (args?.length! > 0) amount = parseInt(args![0]);
        else return channel.send("Please input a valid number");

        // requirements
        if (channel.type == "DM") return;
        if (!message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
            return channel.send("The user does not have permission to delete messages.");
        if (amount > 100)
            return channel.send({
                embeds: [
                    Response(
                        "Error deleting messages.",
                        "You can only delete a **maximum of 100 messages** at a time.",
                        "FAIL"
                    ),
                ],
            });

        // deletes the command message then bulk delete.
        let amount_deleted: number = 0;
        try {
            message.delete();
            await channel.bulkDelete(amount, true).then(async (message) => {
                amount_deleted = message.size;
            });
        } catch (e: any) {
            console.error(`[CLEAR] Error deleting messages: ${e.message}`);
            return onError(message, e);
        }

        let return_embed = Response(
            "Messages were deleted from the text channel.",
            `**${amount_deleted} messages** deleted by **${message.author.tag}**`,
            "SUCCESS"
        );

        if (amount_deleted != amount)
            return_embed.setFooter(
                "Note: messages older than 14 days can't be deleted by the bot."
            );

        return channel
            .send({
                embeds: [return_embed],
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId("delete-message")
                            .setLabel("Delete this message")
                            .setStyle("SECONDARY")
                    ),
                ],
            })
            .then((msg) => {
                msg.awaitMessageComponent({
                    componentType: "BUTTON",
                    filter: (filter) => filter.customId === "delete-message",
                })
                    .then(() => {
                        msg.delete().catch((e) => console.error(`${e}: Error deleting message`));
                    })
                    .catch(() => {
                        console.log("[COLLECTOR]: Button Collector Deleted");
                    });
            });
    },
};
