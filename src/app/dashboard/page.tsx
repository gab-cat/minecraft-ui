import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { DashboardContent } from "@/features/dashboard/components/dashboard-content";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Monitor and manage your Minecraft server."
        icon="/icons/minecraft-chest.svg"
      />
      <div className="p-4">
        <DashboardContent />
      </div>
    </DashboardShell>
  );
}
