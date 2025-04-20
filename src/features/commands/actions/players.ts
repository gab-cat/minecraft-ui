"use server";

import { z } from "zod";
import { rcon } from "@/lib/rcon";
import { playerActionSchema } from "../schema";

// Action to kick a player
export async function kickPlayer(data: z.infer<typeof playerActionSchema>) {
  const validatedData = playerActionSchema.parse(data);
  try {
    const result = await rcon.kick(validatedData.player, validatedData.reason);
    return { success: true, message: result };
  } catch (error) {
    console.error("Error kicking player:", error);
    return { success: false, error: "Failed to kick player" };
  }
}

// Action to ban a player
export async function banPlayer(data: z.infer<typeof playerActionSchema>) {
  const validatedData = playerActionSchema.parse(data);
  try {
    const result = await rcon.ban(validatedData.player, validatedData.reason);
    return { success: true, message: result };
  } catch (error) {
    console.error("Error banning player:", error);
    return { success: false, error: "Failed to ban player" };
  }
}

// Action to pardon a player
export async function pardonPlayer(data: { player: string }) {
  try {
    const result = await rcon.pardon(data.player);
    return { success: true, message: result };
  } catch (error) {
    console.error("Error pardoning player:", error);
    return { success: false, error: "Failed to pardon player" };
  }
}
