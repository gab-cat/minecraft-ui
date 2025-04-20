"use server";

import { z } from "zod";
import { rcon } from "@/lib/rcon";
import { rawCommandSchema } from "../schema";

// Action to execute a raw command
export async function executeRawCommand(
  data: z.infer<typeof rawCommandSchema>
) {
  const validatedData = rawCommandSchema.parse(data);
  try {
    const result = await rcon.executeRaw(validatedData.command);
    return { success: true, message: result };
  } catch (error) {
    console.error("Error executing command:", error);
    return { success: false, error: "Failed to execute command" };
  }
}
