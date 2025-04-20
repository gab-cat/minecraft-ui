import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { CommandTabs } from "@/features/commands/components/command-tabs";

export default function CommandsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Server Commands"
        text="Send commands to your Minecraft server and view the response."
        icon="/icons/minecraft-command-block.svg"
      />
      <div className="p-4 mt-2">
        <CommandTabs />
      </div>
    </DashboardShell>
  );
}
