import { Command } from "../../interfaces/Command";

export const HelloWorld: Command = {
    name: ["hello"],
    description: "Triggers a hello world!",
    run: async (client, message) => {
        return message.channel.send("Hi!");
    },
};
