import { Command } from "../../interfaces";
import { Response } from "../../models";

export const LeaveCommand: Command = {
    name: ["leave", "l"],
    description: "Leaves the voice channel and delete the server queue.",
    run: async (client, message, args, player) => {
        const { channel, guild } = message;

        const leavingQueue = player?.getQueue(guild!.id);
        if (!leavingQueue || !leavingQueue.playing)
            return channel.send({
                embeds: [
                    Response(
                        "Not connected to any voice channel",
                        "Connect me to a voice channel first.",
                        "WARN"
                    ),
                ],
            });
        else {
            channel.send("Left the voice channel.");
            return leavingQueue.destroy();
        }
    },
};
