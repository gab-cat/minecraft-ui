"use server";

import { z } from "zod";
import { rcon } from "@/lib/rcon";
import { sendMessageSchema } from "../schema";

// Action to send a message to the server
export async function sendMessage(data: z.infer<typeof sendMessageSchema>) {
  const validatedData = sendMessageSchema.parse(data);
  try {
    const result = await rcon.say(validatedData.message);
    return { success: true, message: result };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

// Action to get online players
export async function getOnlinePlayers() {
  try {
    const result = await rcon.list();
    return { success: true, message: result };
  } catch (error) {
    console.error("Error getting player list:", error);
    return { success: false, error: "Failed to get player list" };
  }
}
