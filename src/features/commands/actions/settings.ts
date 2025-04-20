"use server";

import { z } from "zod";
import { rcon } from "@/lib/rcon";
import { gamemodeSchema, weatherSchema, timeSchema } from "../schema";

// Action to change game mode
export async function changeGamemode(data: z.infer<typeof gamemodeSchema>) {
  const validatedData = gamemodeSchema.parse(data);
  try {
    const result = await rcon.gamemode(
      validatedData.player,
      validatedData.mode
    );
    return { success: true, message: result };
  } catch (error) {
    console.error("Error changing gamemode:", error);
    return { success: false, error: "Failed to change gamemode" };
  }
}

// Action to change weather
export async function changeWeather(data: z.infer<typeof weatherSchema>) {
  const validatedData = weatherSchema.parse(data);
  try {
    const result = await rcon.weather(validatedData.type);
    return { success: true, message: result };
  } catch (error) {
    console.error("Error changing weather:", error);
    return { success: false, error: "Failed to change weather" };
  }
}

// Action to change time
export async function changeTime(data: z.infer<typeof timeSchema>) {
  const validatedData = timeSchema.parse(data);
  try {
    const result = await rcon.time(validatedData.setting);
    return { success: true, message: result };
  } catch (error) {
    console.error("Error changing time:", error);
    return { success: false, error: "Failed to change time" };
  }
}
