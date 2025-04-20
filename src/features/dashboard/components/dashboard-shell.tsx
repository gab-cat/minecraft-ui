"use client";

import Link from "next/link";
import Image from "next/image";
import { DashboardNav } from "./dashboard-nav";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {" "}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm dark:bg-card/95">
        <div className="container  max-w-7xl mx-auto flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.webp"
                alt="Minecraft"
                width={32}
                height={32}
                className="text-primary"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-primary tracking-tight">
                  Minecraft Manager
                </h1>
                <span className="text-xs text-muted-foreground">
                  by gab-cat
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/gab-cat/minecraft-ui"
              target="_blank"
              className="text-foreground/70 flex space-x-2 hover:text-primary transition-colors"
              title="View on GitHub"
            >
              <span>View on GitHub</span>
              <Github size={22} className="border rounded-full" />
            </Link>
          </div>
        </div>
      </header>{" "}
      <div
        style={{
          position: "relative",
        }}
        className="w-full grid flex-1 gap-12 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            pointerEvents: "none", // Optional: mouse events pass through
          }}
        >
          <Image
            src="/images/wallpaper.png"
            alt="Wallpaper"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.75,
              zIndex: -1,
            }}
            quality={90}
            priority
          />
        </div>{" "}
        <aside className="hidden w-[220px] bg-white/80 flex-col md:flex lg:w-[260px]">
          <div className="sticky top-16 py-6">
            <div className="mb-6 px-3">
              <div className="flex items-center gap-3 rounded-md border border-primary/20 bg-primary/5 p-3 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10">
                <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center">
                  <Image
                    src="/icons/minecraft-server.svg"
                    alt="Server"
                    width={24}
                    height={24}
                    className="text-primary"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-sm font-medium text-primary">
                      Server Online
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">mc.gab-cat.me</p>
                </div>
              </div>
            </div>
            <DashboardNav />
          </div>{" "}
        </aside>{" "}
        <main className="flex w-full flex-col overflow-hidden py-6">
          <motion.div className="rounded-lg bg-white/90 p-4 border border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
            {children}
          </motion.div>
        </main>
      </div>{" "}
      <footer className="py-6 md:px-8 md:py-0 border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/minecraft-server.svg"
              alt="Minecraft"
              width={20}
              height={20}
              className="opacity-70"
            />
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Minecraft Manager by{" "}
              <span className="text-primary font-medium">gab-cat</span>
            </p>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link
              href="/dashboard"
              className="text-xs hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/commands"
              className="text-xs hover:text-primary transition-colors"
            >
              Commands
            </Link>
            <Link
              href="/players"
              className="text-xs hover:text-primary transition-colors"
            >
              Players
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
