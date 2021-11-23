import { Prefix } from ".";
import { getResponse, getLocale, getPrefix, setResponse, setLocale } from "../../db";
import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Config: Command = {
    name: ["config"],
    arguments: ["?", "setting] [value"],
    description:
        "Configure the bot in the current guild. Use the command without arguments to see the available configurations.\nThis command is only available for admins.",
    run: async (prefix, client, message, args, player, postgres) => {
        const { channel, guild } = message;

        if (args?.length === 0)
            return channel.send({
                embeds: [
                    Response(
                        "List of available configurations",
                        `Use **${prefix}config [setting] [value]** to change the config in the current server.\nOnly admins can use this command.`,
                        "SUCCESS"
                    )
                        .addField(
                            ":small_blue_diamond: language",
                            `Sets the language of the bot\n**Values: EN | BR\nCurrent: ${
                                (await getLocale(postgres!, guild!)) === "br"
                                    ? "Português"
                                    : "English"
                            }**`,
                            true
                        )
                        .addField(
                            ":small_blue_diamond: response",
                            `Sets if the bot will respond when someone says anything that contains 'bog' in a text channel.\nNote: The bot will only respond in Brazilian Portuguese.\n**Values: true | false\nCurrent: ${await getResponse(
                                postgres!,
                                guild!
                            )}**`,
                            true
                        )
                        .addField(
                            ":small_blue_diamond: prefix",
                            `Changes the prefix that the bot will respond to.\n**Values: [new prefix]\nCurrent: ${await getPrefix(
                                postgres!,
                                guild!
                            )}**`,
                            true
                        ),
                ],
            });

        switch (args![0]) {
            case "language" || "lang": {
                switch (args![1]) {
                    case "en" || "EN" || "english" || "ingles" || "inglês":
                        if ((await getLocale(postgres!, guild!)) !== "en")
                            return await setLocale(postgres!, guild!, "en").then(() => {
                                channel.send("Bot language set to **English**.");
                            });
                        return channel.send(
                            "The bot is already set to respond in English, please select another language."
                        );
                    case "br" ||
                        "BR" ||
                        "pt" ||
                        "ptbr" ||
                        "portugues" ||
                        "português" ||
                        "portuguese":
                        if ((await getLocale(postgres!, guild!)) !== "br")
                            return await setLocale(postgres!, guild!, "br").then(() => {
                                channel.send(
                                    "O idioma Português ainda está em desenvolvimento\nPorém quando os comandos forem traduzidos, o bot responderá em **Português**"
                                );
                            });
                        return channel.send(
                            "O bot já está selecionado para responder em Português, selecione outro idioma."
                        );
                    default:
                        return channel.send({
                            embeds: [
                                Response(
                                    "Error",
                                    "Please input a valid language.\nThe available languages are: **EN | BR**",
                                    "FAIL"
                                ),
                            ],
                        });
                }
            }
            case "response" || "res": {
                switch (args![1]) {
                    case "true": {
                        if ((await getResponse(postgres!, guild!)) !== true)
                            return await setResponse(postgres!, guild!, true).then(() => {
                                channel.send(
                                    `The bot will now respond when someone says 'bog' in a text channel.`
                                );
                            });

                        return channel.send(`The bot is already responding to 'bog'.`);
                    }
                    case "false": {
                        if ((await getResponse(postgres!, guild!)) !== false)
                            return await setResponse(postgres!, guild!, false).then(() => {
                                channel.send(`The bot is no longer responding to 'bog'.`);
                            });
                        return channel.send(`The bot already is not responding to 'bog'`);
                    }
                    default:
                        return channel.send({
                            embeds: [
                                Response(
                                    "Error",
                                    "Please input a valid argument.\nThe available arguments are: **true | false**",
                                    "FAIL"
                                ),
                            ],
                        });
                }
            }
            case "prefix": {
                return Prefix.run(prefix, client, message, Array(args![1]), player, postgres);
            }
            default:
                return channel.send({
                    embeds: [
                        Response(
                            "Error",
                            `Please input a valid configuration from the list.\nYou can check the list by using ${prefix}config`,
                            "FAIL"
                        ),
                    ],
                });
        }
    },
};
