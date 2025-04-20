import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function LogsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Server Logs"
        text="Stream and view real-time logs from your Minecraft server."
        icon="/icons/minecraft-command-block.svg"
      />
      <div className="p-4 mt-2">
        <div>Under Construction</div>
        <div>More features coming soon!</div>
      </div>
    </DashboardShell>
  );
}
