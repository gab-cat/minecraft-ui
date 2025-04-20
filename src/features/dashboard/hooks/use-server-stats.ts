"use client";

import { useQuery } from "@tanstack/react-query";
import { getServerStats } from "@/features/dashboard/actions/server-stats";
import { format } from "date-fns";

// Calculate last restart date based on uptime string
function getLastRestartDate(uptimeString: string): string {
  // Parse uptime in format "3d 5h 12m"
  const parts = uptimeString.match(/(\d+)d\s+(\d+)h\s+(\d+)m/);
  if (!parts) return "Unknown";

  const days = parseInt(parts[1]);
  const hours = parseInt(parts[2]);
  const minutes = parseInt(parts[3]);

  const now = new Date();
  const restartDate = new Date(
    now.getTime() -
      days * 24 * 60 * 60 * 1000 -
      hours * 60 * 60 * 1000 -
      minutes * 60 * 1000
  );

  return format(restartDate, "MMM d, yyyy");
}

export function useServerStats() {
  return useQuery({
    queryKey: ["serverStats"],
    queryFn: getServerStats,
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    staleTime: 30000, // Data becomes stale after 30 seconds
  });
}

export { getLastRestartDate };
