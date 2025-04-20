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

// RCON client optimized for edge runtime
class RconClient {
  private client: Rcon | null = null;
  private env: EnvVars | null = null;
  private connectionTimeout: number = 15000; // 15 seconds connection timeout
  private commandTimeout: number = 5000; // 5 seconds command timeout

  constructor() {}

  public async connect(): Promise<void> {
    if (this.client) {
      return;
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
      await this.connect();

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
    } finally {
      // Always disconnect after command completes in edge environment
      await this.disconnect();
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

// Preserve the export interface while creating a new instance for each request
export const rcon = {
  say: async (message: string): Promise<string> => {
    const client = new RconClient();
    return client.say(message);
  },
  kick: async (player: string, reason?: string): Promise<string> => {
    const client = new RconClient();
    return client.kick(player, reason);
  },
  ban: async (player: string, reason?: string): Promise<string> => {
    const client = new RconClient();
    return client.ban(player, reason);
  },
  banIp: async (ip: string, reason?: string): Promise<string> => {
    const client = new RconClient();
    return client.banIp(ip, reason);
  },
  pardon: async (player: string): Promise<string> => {
    const client = new RconClient();
    return client.pardon(player);
  },
  pardonIp: async (ip: string): Promise<string> => {
    const client = new RconClient();
    return client.pardonIp(ip);
  },
  op: async (player: string): Promise<string> => {
    const client = new RconClient();
    return client.op(player);
  },
  deop: async (player: string): Promise<string> => {
    const client = new RconClient();
    return client.deop(player);
  },
  teleport: async (target: string, destination: string): Promise<string> => {
    const client = new RconClient();
    return client.teleport(target, destination);
  },
  give: async (
    player: string,
    item: string,
    amount?: number
  ): Promise<string> => {
    const client = new RconClient();
    return client.give(player, item, amount);
  },
  weather: async (type: "clear" | "rain" | "thunder"): Promise<string> => {
    const client = new RconClient();
    return client.weather(type);
  },
  time: async (setting: "day" | "night" | number): Promise<string> => {
    const client = new RconClient();
    return client.time(setting);
  },
  gamemode: async (
    player: string,
    mode: "survival" | "creative" | "adventure" | "spectator"
  ): Promise<string> => {
    const client = new RconClient();
    return client.gamemode(player, mode);
  },
  whitelist: async (
    action: "add" | "remove" | "list" | "on" | "off" | "reload",
    player?: string
  ): Promise<string> => {
    const client = new RconClient();
    return client.whitelist(action, player);
  },
  list: async (): Promise<string> => {
    const client = new RconClient();
    return client.list();
  },
  executeRaw: async (command: string): Promise<string> => {
    const client = new RconClient();
    return client.executeRaw(command);
  },
};
