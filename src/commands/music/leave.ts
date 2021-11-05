import { Command } from "../../interfaces";

export const LeaveCommand: Command = {
    name: ["leave", "l"],
    description: "Leaves the voice channel and delete the server queue.",
    run: async (client, message, args, player) => {
        const { channel, guild } = message;

        const leavingQueue = player?.getQueue(guild!.id);
        if (!leavingQueue || !leavingQueue.playing)
            return channel.send("I'm not playing anything, leave me alone.");
        else {
            channel.send("Left the voice channel.");
            return leavingQueue.destroy();
        }
    },
};
