"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Terminal, Users } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardNavProps {
  className?: string;
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname();
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      minecraftIcon: "/icons/minecraft-chest.svg",
    },
    {
      title: "Commands",
      href: "/commands",
      icon: Terminal,
      minecraftIcon: "/icons/minecraft-command-block.svg",
    },
    {
      title: "Logs",
      href: "/logs",
      icon: Users,
      minecraftIcon: "/icons/minecraft-player.svg",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.nav
      className={cn("grid items-start gap-2", className)}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {navigationItems.map((item, index) => (
        <motion.div
          key={item.href}
          variants={itemVariant}
          custom={index}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-primary/10",
              pathname === item.href
                ? "bg-primary/10 text-primary font-semibold"
                : "text-foreground/70"
            )}
          >
            <div className="mr-2 h-8 w-8 rounded-md flex items-center justify-center">
              {item.minecraftIcon && (
                <Image
                  src={item.minecraftIcon}
                  alt={item.title}
                  width={20}
                  height={20}
                  className={cn(
                    "transition-all duration-300 group-hover:rotate-12",
                    pathname === item.href
                      ? "text-primary opacity-100"
                      : "opacity-70 group-hover:opacity-100"
                  )}
                />
              )}
            </div>
            <span>{item.title}</span>
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}
