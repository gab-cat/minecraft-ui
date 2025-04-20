"use server";

import { z } from "zod";
import { rcon } from "@/lib/rcon";
import { whitelistSchema } from "../schema";

// Action to manage whitelist
export async function manageWhitelist(data: z.infer<typeof whitelistSchema>) {
  const validatedData = whitelistSchema.parse(data);
  try {
    const result = await rcon.whitelist(
      validatedData.action,
      validatedData.player
    );
    return { success: true, message: result };
  } catch (error) {
    console.error("Error managing whitelist:", error);
    return { success: false, error: "Failed to manage whitelist" };
  }
}
