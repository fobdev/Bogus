import { CommandInt } from "../../interfaces/CommandInt";

export const HelloWorld: CommandInt = {
    name: "hello",
    description: "Triggers a hello world!",
    run: async (client, message) => {
        return message.channel.send("Hi!");
    },
};
