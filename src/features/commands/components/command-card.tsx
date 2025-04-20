"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Command, LucideIcon } from "lucide-react";

interface CommandCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function CommandCard({
  title,
  description,
  children,
  icon: Icon = Command,
  className,
}: CommandCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Card
      className={cn(
        "transition-all duration-300 border-primary/10 hover:bg-white hover:border-primary/30 hover:shadow-md",
        isHovered && "bg-primary/5",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={cardRef}
    >
      <CardHeader className="flex flex-row items-start gap-3">
        <div
          className={`h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center transition-transform duration-300 ${
            isHovered ? "scale-110" : ""
          }`}
        >
          <Icon
            size={22}
            className={`text-primary transition-all duration-300 ${
              isHovered ? "rotate-12" : ""
            }`}
          />
        </div>
        <div>
          <CardTitle className="text-primary">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent
        className={`transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-90"
        }`}
      >
        {children}
      </CardContent>
    </Card>
  );
}
