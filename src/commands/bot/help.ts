import { Command } from "../../interfaces";
import { CommandList } from "../_CommandList";

export const Help: Command = {
    name: ["help"],
    description: "Display all the available commands.",
    run: async (client, message, args) => {
        let { channel } = message;

        if (args?.length! <= 0)
            return channel.send("Please input a command from which you need help.");

        for (const Command of CommandList)
            if (Command.name.find((element) => element === args![0]))
                return channel.send(Command.description);
    },
};
