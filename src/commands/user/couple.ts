import { Command } from "../../interfaces";

export const Couple: Command = {
    name: ["couple"],
    description: "Connect the profile picture of two users.",
    run: async (prefix, client, message) => {
        const { channel, author } = message;
    },
};
