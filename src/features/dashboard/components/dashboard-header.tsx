"use client";

import Image from "next/image";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  icon?: string;
}

export function DashboardHeader({
  heading,
  text,
  children,
  icon = "/icons/minecraft-chest.svg",
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 py-2 border-b border-border/60 mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Image src={icon} alt={heading} width={24} height={24} />
          </div>
        )}
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-wide text-primary">
            {heading}
          </h1>
          {text && <p className="text-muted-foreground text-sm">{text}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
