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

  private constructor() {}

  public static getInstance(): RconClient {
    if (!RconClient.instance) {
      RconClient.instance = new RconClient();
    }
    return RconClient.instance;
  }

  public async connect(): Promise<void> {
    if (this.client) {
      // Already connected
      return;
    }

    try {
      // Validate environment variables
      this.env = environmentSchema.parse({
        RCON_HOST: getCloudflareContext().env.RCON_HOST,
        RCON_PORT: getCloudflareContext().env.RCON_PORT,
        RCON_PASSWORD: getCloudflareContext().env.RCON_PASSWORD,
      });

      this.client = await Rcon.connect({
        host: this.env.RCON_HOST,
        port: this.env.RCON_PORT,
        password: this.env.RCON_PASSWORD,
      });
    } catch (error) {
      console.log(this.env);
      console.error("Failed to connect to RCON server:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }

  // Generic command method
  private async sendCommand(command: string): Promise<string> {
    if (!this.client) {
      await this.connect();
    }
    return this.client!.send(command);
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
