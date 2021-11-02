import { Command } from "../../interfaces";

export const Ping: Command = {
    name: ["ping"],
    description: "Displays the ping of the client.",
    run: async (client, message) => {
        message.channel.send(`Client ping: ${client.ws.ping}ms`);
    },
};
