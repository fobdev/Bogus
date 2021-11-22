import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Bug: Command = {
    name: ["bug"],
    arguments: ["description"],
    description: "Report bugs to the developer.",
    run: async (prefix, client, message, args) => {
        const { author, channel, guild } = message;

        if (args?.length === 0)
            return channel.send({
                embeds: [Response("Error", "You need to describe the bug.", "FAIL")],
            });

        const dev = client.users.cache.find((user) => user.id === process.env.DEVELOPER_ID);
        if (!dev) return console.log("Could not find the developer user.");

        dev.send({
            embeds: [
                Response("BUG REPORTED", args!.join(" "), "WARN")
                    .setThumbnail(author.displayAvatarURL())
                    .addField("Sent by", `${author}`, true)
                    .addField("Guild", `${guild?.name}`, true)
                    .setTimestamp(Date.now()),
            ],
        }).then((msg) => {
            return channel.send({
                embeds: [
                    Response(
                        "Message sent to the developer",
                        "Thanks for your support!",
                        "SUCCESS"
                    ).setThumbnail(client.user!.displayAvatarURL()),
                ],
            });
        });
    },
};
