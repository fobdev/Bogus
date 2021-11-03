import { Command } from "../../interfaces";
import { Response } from "../../models";
import { CommandList } from "../_CommandList";
import botconfig from "../../botconfig.json";

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
                    Command.name.forEach((element, index) => {
                        if (Command.arguments?.length! > 0) {
                            if (Command.arguments!.find((opt) => opt === "?")) {
                                finalString += "```" + `${botconfig.prefix}${element}\n` + "```";

                                finalString +=
                                    "```" +
                                    `${botconfig.prefix}${element} [${Command.arguments
                                        ?.slice(1)
                                        .join("] or [")}]\n` +
                                    "```";
                            } else
                                finalString +=
                                    "```" +
                                    `${botconfig.prefix}${element} [${Command.arguments?.join(
                                        "] or ["
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
    },
};
