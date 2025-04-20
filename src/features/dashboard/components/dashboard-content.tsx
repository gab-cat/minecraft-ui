"use client";

import { useServerStats, getLastRestartDate } from "../hooks/use-server-stats";
import { restartServer, connectToServer } from "../actions/server-controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export function DashboardContent() {
  const { data: serverStats, isLoading, error, refetch } = useServerStats();

  // Define mutation for server restart
  const restartMutation = useMutation({
    mutationFn: restartServer,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Server restart initiated successfully");
        // Refetch server stats after a delay
        setTimeout(() => {
          refetch();
        }, 15000); // Give server time to restart
      } else {
        toast.error(data.error || "Failed to restart server");
      }
    },
    onError: () => {
      toast.error("An error occurred while restarting the server");
    },
  });

  // Define mutation for server connection
  const connectMutation = useMutation({
    mutationFn: connectToServer,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          `Connect to server at ${data.serverDetails?.address}:${data.serverDetails?.port}`
        );
      } else {
        toast.error(data.error || "Failed to get connection details");
      }
    },
    onError: () => {
      toast.error(
        "An error occurred while retrieving server connection details"
      );
    },
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading server status...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !serverStats) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-5">
        <h3 className="text-lg font-semibold text-red-800">
          Error connecting to server
        </h3>
        <p className="text-red-600">
          Unable to fetch server statistics. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Server status section */}
      <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <Image
            src="/images/minecraft-logo.png"
            alt="Minecraft"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-primary/20 flex items-center justify-center">
              <Image
                src="/icons/minecraft-server.svg"
                alt="Server"
                width={28}
                height={28}
                className="text-primary"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">
                Server Status
              </h2>
              <div className="flex items-center gap-2">
                {serverStats.isOnline ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-sm text-muted-foreground">
                      Online • {serverStats.serverInfo.ip}:
                      {serverStats.serverInfo.port}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <p className="text-sm text-muted-foreground">
                      Offline • {serverStats.serverInfo.ip}:
                      {serverStats.serverInfo.port}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>{" "}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary/10"
              disabled={!serverStats.isOnline}
              onClick={() => {
                restartMutation.mutate();
              }}
            >
              Restart Server
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              disabled={!serverStats.isOnline}
              onClick={() => {
                connectMutation.mutate();
              }}
            >
              Connect
            </Button>
          </div>
        </div>
      </div>{" "}
      {/* Quick actions and stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-primary/10 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader className="pb-2">
            {" "}
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Image
                src="/icons/minecraft-player.svg"
                alt="Logs"
                width={20}
                height={20}
                className="text-primary"
              />
              Server Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-primary">
                {serverStats.playerCount.online} / {serverStats.playerCount.max}
              </div>
              <div
                className={`${
                  serverStats.isOnline
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-200 text-gray-500"
                } text-xs px-2 py-1 rounded-md`}
              >
                {serverStats.isOnline
                  ? serverStats.playerCount.online > 0
                    ? "Active"
                    : "Idle"
                  : "Offline"}
              </div>
            </div>{" "}
          </CardContent>
          <CardFooter className="pt-0">
            <Link
              href="/logs"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              View all logs →
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-primary/10 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Image
                src="/icons/minecraft-server.svg"
                alt="Uptime"
                width={20}
                height={20}
                className="text-primary"
              />
              Server Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-primary">
                {serverStats.uptime}
              </div>
              <div
                className={`${
                  serverStats.isOnline
                    ? "bg-green-500/10 text-green-500"
                    : "bg-gray-200 text-gray-500"
                } text-xs px-2 py-1 rounded-md`}
              >
                {serverStats.isOnline ? "Stable" : "Offline"}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">
              Last restart: {getLastRestartDate(serverStats.uptime)}
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Game Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary capitalize">
              {serverStats.gameMode}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link
              href="/commands"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Change game settings →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {serverStats.memoryUsage.used} / {serverStats.memoryUsage.max} GB
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">
              {serverStats.memoryUsage.percentage}% utilized
            </p>
          </CardFooter>
        </Card>
      </div>{" "}
      {/* Quick access commands */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Commands</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/commands?action=message">
            <Card className="hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/minecraft-command-block.svg"
                    alt="Command"
                    width={18}
                    height={18}
                  />
                  <CardTitle className="text-md font-medium">
                    Send Message
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Broadcast a message to all online players
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/commands?action=weather">
            <Card className="hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/minecraft-command-block.svg"
                    alt="Command"
                    width={18}
                    height={18}
                  />
                  <CardTitle className="text-md font-medium">
                    Change Weather
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set the weather to clear, rain, or thunder
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/commands?action=time">
            <Card className="hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/minecraft-command-block.svg"
                    alt="Command"
                    width={18}
                    height={18}
                  />
                  <CardTitle className="text-md font-medium">
                    Change Time
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Set the time to day or night</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
      {/* Server information */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Server Information</h2>
        <Card>
          <CardContent className="p-0">
            <div className="grid divide-y">
              <div className="grid grid-cols-2 p-4">
                <div className="text-sm font-medium">Version</div>
                <div className="text-sm text-muted-foreground">
                  {serverStats.version}
                </div>
              </div>
              <div className="grid grid-cols-2 p-4">
                <div className="text-sm font-medium">Server IP</div>
                <div className="text-sm text-muted-foreground">
                  {serverStats.serverInfo.ip}
                </div>
              </div>
              <div className="grid grid-cols-2 p-4">
                <div className="text-sm font-medium">Port</div>
                <div className="text-sm text-muted-foreground">
                  {serverStats.serverInfo.port}
                </div>
              </div>
              <div className="grid grid-cols-2 p-4">
                <div className="text-sm font-medium">RCON Port</div>
                <div className="text-sm text-muted-foreground">
                  {serverStats.serverInfo.rconPort}
                </div>
              </div>
              <div className="grid grid-cols-2 p-4">
                <div className="text-sm font-medium">Difficulty</div>
                <div className="text-sm text-muted-foreground">
                  {serverStats.serverInfo.difficulty}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
