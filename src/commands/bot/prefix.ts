import { setPrefix } from "../../db";
import { Command } from "../../interfaces";
import { Response } from "../../models";

export const Prefix: Command = {
    name: ["prefix"],
    description: "Changes the bot prefix for this server.",
    run: async (prefix, client, message, args, player, postgres) => {
        let queryString = "INSERT INTO guilds(id, prefix, locale) VALUES ";

        const guilds = client.guilds.cache.toJSON();

        guilds.map((value, index, array) => {
            queryString += `(${value.id}, '>', 'en')`;

            if (index === array.length - 1) queryString += ";";
            else queryString += ",";
        });

        postgres?.query(queryString);

        // const { channel, guild } = message;

        // if (!args![0] || args!.length > 1 || args![0].length > 3)
        //     return channel.send({
        //         embeds: [
        //             Response(
        //                 "Error",
        //                 "Please input a valid prefix with a max. of 3 characters.",
        //                 "FAIL"
        //             ),
        //         ],
        //     });

        // await setPrefix(postgres!, guild!, args![0]);
        // return channel.send({
        //     embeds: [
        //         Response(
        //             `${guild?.name} prefix changed.`,
        //             `The new prefix of the guild is now ${args![0]}`,
        //             "SUCCESS"
        //         ),
        //     ],
        // });
    },
};
