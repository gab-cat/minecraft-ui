import { z } from "zod";

// Schema for sending a message
export const sendMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(100, "Message is too long"),
});

// Schema for player actions
export const playerActionSchema = z.object({
  player: z.string().min(1, "Player name is required"),
  reason: z.string().optional(),
});

// Schema for item giving
export const giveItemSchema = z.object({
  player: z.string().min(1, "Player name is required"),
  item: z.string().min(1, "Item is required"),
  amount: z.number().int().positive().optional().default(1),
});

// Schema for teleporting
export const teleportSchema = z.object({
  target: z.string().min(1, "Target player is required"),
  destination: z.string().min(1, "Destination is required"),
});

// Schema for changing game mode
export const gamemodeSchema = z.object({
  player: z.string().min(1, "Player name is required"),
  mode: z.enum(["survival", "creative", "adventure", "spectator"]),
});

// Schema for whitelist actions
export const whitelistSchema = z.object({
  action: z.enum(["add", "remove", "list", "on", "off", "reload"]),
  player: z.string().optional(),
});

// Schema for weather changes
export const weatherSchema = z.object({
  type: z.enum(["clear", "rain", "thunder"]),
});

// Schema for time changes
export const timeSchema = z.object({
  setting: z.union([z.enum(["day", "night"]), z.number().int()]),
});

// Schema for raw commands
export const rawCommandSchema = z.object({
  command: z.string().min(1, "Command is required"),
});
