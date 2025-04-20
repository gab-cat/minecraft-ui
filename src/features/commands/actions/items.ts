"use server";

import { z } from "zod";
import { rcon } from "@/lib/rcon";
import { giveItemSchema, teleportSchema } from "../schema";

// Action to give an item to a player
export async function giveItem(data: z.infer<typeof giveItemSchema>) {
  const validatedData = giveItemSchema.parse(data);
  try {
    const result = await rcon.give(
      validatedData.player,
      validatedData.item,
      validatedData.amount
    );
    return { success: true, message: result };
  } catch (error) {
    console.error("Error giving item:", error);
    return { success: false, error: "Failed to give item" };
  }
}

// Action to teleport a player
export async function teleportPlayer(data: z.infer<typeof teleportSchema>) {
  const validatedData = teleportSchema.parse(data);
  try {
    const result = await rcon.teleport(
      validatedData.target,
      validatedData.destination
    );
    return { success: true, message: result };
  } catch (error) {
    console.error("Error teleporting player:", error);
    return { success: false, error: "Failed to teleport player" };
  }
}
