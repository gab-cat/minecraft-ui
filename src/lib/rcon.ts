import { Rcon } from "rcon-client";
import { z } from "zod";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

// Environment variable schema validation
export const environmentSchema = z.object({
  RCON_HOST: z.string().min(1, "RCON host is required"),
  RCON_PORT: z.string().transform((val) => parseInt(val, 10)),
  RCON_PASSWORD: z.string().min(1, "RCON password is required"),
});

// Type for the validated environment variables
type EnvVars = z.infer<typeof environmentSchema>;

// RCON client singleton
class RconClient {
  private static instance: RconClient | null = null;
  private client: Rcon | null = null;
  private env: EnvVars | null = null;
  private lastUsedTime: number = 0;
  private connectionTimeout: number = 15000; // 15 seconds connection timeout
  private commandTimeout: number = 5000; // 5 seconds command timeout

  private constructor() {}

  public static getInstance(): RconClient {
    if (!RconClient.instance) {
      RconClient.instance = new RconClient();
    }
    return RconClient.instance;
  }

  public async connect(): Promise<void> {
    const currentTime = Date.now();

    // Check if we need to refresh the connection
    if (this.client) {
      // If connection is older than the timeout or seems stale, refresh it
      if (currentTime - this.lastUsedTime > this.connectionTimeout) {
        await this.disconnect();
      } else {
        // Connection is still fresh
        this.lastUsedTime = currentTime;
        return;
      }
    }

    try {
      // Validate environment variables
      this.env = environmentSchema.parse({
        RCON_HOST: getCloudflareContext().env.RCON_HOST,
        RCON_PORT: getCloudflareContext().env.RCON_PORT,
        RCON_PASSWORD: getCloudflareContext().env.RCON_PASSWORD,
      });

      // Create a new RCON client with timeout options
      this.client = await Rcon.connect({
        host: this.env.RCON_HOST,
        port: this.env.RCON_PORT,
        password: this.env.RCON_PASSWORD,
        timeout: this.commandTimeout, // Use a reasonable timeout for commands
      });

      this.lastUsedTime = currentTime;
    } catch (error) {
      console.error("Failed to connect to RCON server:", error);
      this.client = null;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.end();
      } catch (error) {
        console.error("Error disconnecting from RCON server:", error);
      } finally {
        this.client = null;
      }
    }
  }

  // Generic command method
  private async sendCommand(command: string): Promise<string> {
    try {
      if (!this.client) {
        await this.connect();
      }

      // Update last used time
      this.lastUsedTime = Date.now();

      // Add timeout handling
      const result = (await Promise.race([
        this.client!.send(command),
        new Promise<string>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Command timeout: ${command}`));
          }, this.commandTimeout);
        }),
      ])) as string;

      return result;
    } catch (error) {
      console.error(`Error executing command "${command}":`, error);

      // Reset connection if there was an error
      await this.disconnect();

      // Try to reconnect and retry once
      try {
        await this.connect();
        return await this.client!.send(command);
      } catch (retryError) {
        console.error(`Retry failed for command "${command}":`, retryError);
        throw retryError;
      }
    }
  }

  // Specific command methods
  public async say(message: string): Promise<string> {
    return this.sendCommand(`tellraw @a "${message}"`);
  }

  public async kick(player: string, reason?: string): Promise<string> {
    return this.sendCommand(`kick ${player}${reason ? ` ${reason}` : ""}`);
  }

  public async ban(player: string, reason?: string): Promise<string> {
    return this.sendCommand(`ban ${player}${reason ? ` ${reason}` : ""}`);
  }

  public async banIp(ip: string, reason?: string): Promise<string> {
    return this.sendCommand(`ban-ip ${ip}${reason ? ` ${reason}` : ""}`);
  }

  public async pardon(player: string): Promise<string> {
    return this.sendCommand(`pardon ${player}`);
  }

  public async pardonIp(ip: string): Promise<string> {
    return this.sendCommand(`pardon-ip ${ip}`);
  }

  public async op(player: string): Promise<string> {
    return this.sendCommand(`op ${player}`);
  }

  public async deop(player: string): Promise<string> {
    return this.sendCommand(`deop ${player}`);
  }

  public async teleport(target: string, destination: string): Promise<string> {
    return this.sendCommand(`tp ${target} ${destination}`);
  }

  public async give(
    player: string,
    item: string,
    amount?: number
  ): Promise<string> {
    return this.sendCommand(
      `give ${player} ${item}${amount ? ` ${amount}` : ""}`
    );
  }

  public async weather(type: "clear" | "rain" | "thunder"): Promise<string> {
    return this.sendCommand(`weather ${type}`);
  }

  public async time(setting: "day" | "night" | number): Promise<string> {
    return this.sendCommand(`time set ${setting}`);
  }

  public async gamemode(
    player: string,
    mode: "survival" | "creative" | "adventure" | "spectator"
  ): Promise<string> {
    return this.sendCommand(`gamemode ${mode} ${player}`);
  }

  public async whitelist(
    action: "add" | "remove" | "list" | "on" | "off" | "reload",
    player?: string
  ): Promise<string> {
    return this.sendCommand(`whitelist ${action}${player ? ` ${player}` : ""}`);
  }

  public async list(): Promise<string> {
    return this.sendCommand("list");
  }

  public async executeRaw(command: string): Promise<string> {
    return this.sendCommand(command);
  }
}

export const rcon = RconClient.getInstance();
