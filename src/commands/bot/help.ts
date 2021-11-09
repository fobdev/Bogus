import { MessageEmbed } from "discord.js";
import { Command } from "../../interfaces";
import { Response } from "../../models";
import { CommandList } from "../_CommandList";
import botconfig from "../../botconfig.json";
import fs from "fs";
import util from "util";

// FS to get the outside dependencies
const readdir = util.promisify(fs.readdir);
const getCommandsFrom = async (folder: string, embed: MessageEmbed) => {
    let commandsArray: Array<string> = [];

    try {
        await readdir(`./src/commands/${folder}/`).then((files) => {
            if (files.length === 0) throw new Error("Nothing was found inside the directory");
            files.forEach((file) => {
                if (file !== "index.ts") commandsArray.push(file.slice(0, file.length - 3));
            });
        });
    } catch (error) {
        console.error(error);
    }

    return embed.addField(
        `${folder.toUpperCase()} Commands`,
        "``[" + commandsArray.join("]`` ``[") + "]``"
    );
};

export const Help: Command = {
    name: ["help"],
    arguments: ["?", "command"],
    description: "Display all the available commands.",
    run: async (client, message, args) => {
        let { channel } = message;

        if (args?.length! > 0)
            for (const Command of CommandList) {
                let usageHelper = () => {
                    let finalString: string = "";
                    Command.name.forEach((element) => {
                        if (Command.arguments?.length! > 0) {
                            if (Command.arguments!.find((opt) => opt === "?")) {
                                finalString += "```" + `${botconfig.prefix}${element}\n` + "```";

                                finalString +=
                                    "```" +
                                    `${botconfig.prefix}${element} [${Command.arguments
                                        ?.slice(1)
                                        .join("], [")}]\n` +
                                    "```";
                            } else
                                finalString +=
                                    "```" +
                                    `${botconfig.prefix}${element} [${Command.arguments?.join(
                                        "], ["
                                    )}]\n` +
                                    "```";
                        } else finalString += "```" + `${botconfig.prefix}${element}\n` + "```";
                    });
                    return finalString;
                };

                if (Command.name.find((element) => element === args![0]))
                    return channel.send({
                        embeds: [
                            Response(
                                Command.name[0].toUpperCase(),
                                Command.description,
                                "OTHER"
                            ).addField("Usage", usageHelper()),
                        ],
                    });
            }

        let generatedResponse = Response(
            `${client.user?.username.toUpperCase()} Commands List (beta)`,
            `This is a complete list of all the commands available from ${client.user?.username}\n` +
                "**Commands can be accessed using the prefix ``" +
                botconfig.prefix +
                "``**",
            "SUCCESS"
        )
            .setFooter(
                `You can also use ${botconfig.prefix}help [command] to see help from a specific command.`
            )
            .setThumbnail(client.user?.avatarURL({ size: 2048 })!);

        await getCommandsFrom("admin", generatedResponse);
        await getCommandsFrom("bot", generatedResponse);
        await getCommandsFrom("user", generatedResponse);
        await getCommandsFrom("music", generatedResponse);
        await getCommandsFrom("soundeffects", generatedResponse);

        return channel.send({
            embeds: [generatedResponse],
        });
    },
};
