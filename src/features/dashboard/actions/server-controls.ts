"use server";

import { rcon } from "@/lib/rcon";

/**
 * Restart the Minecraft server
 */
export async function restartServer() {
  try {
    // Connect to RCON
    await rcon.connect();

    // Send a warning message to all players
    await rcon.executeRaw(
      "say Server will restart in 10 seconds. Please prepare for disconnection."
    );

    // Wait for 10 seconds before actually restarting
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Execute restart command
    const result = await rcon.executeRaw("restart");

    // Disconnect from RCON
    await rcon.disconnect();

    return {
      success: true,
      message: "Server restart initiated successfully",
    };
  } catch (error) {
    console.error("Failed to restart server:", error);
    return {
      success: false,
      error: "Failed to restart the server. Please try again later.",
    };
  }
}

/**
 * Connect to the Minecraft server
 */
export async function connectToServer() {
  try {
    // This would typically redirect to the Minecraft client or provide connection details
    // In a web UI, we might just return the connection details
    return {
      success: true,
      message: "Connection details retrieved successfully",
      serverDetails: {
        address: "mc.gab-cat.me",
        port: "25565",
      },
    };
  } catch (error) {
    console.error("Failed to retrieve connection details:", error);
    return {
      success: false,
      error: "Failed to retrieve server connection details.",
    };
  }
}
