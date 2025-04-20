"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommandCard } from "./command-card";
import { MessageForm } from "./message-form";
import { PlayerForm } from "./player-form";
import { GameSettingsForm } from "./game-settings-form";
import { WhitelistForm } from "./whitelist-form";
import { RawCommandForm } from "./raw-command-form";
import {
  Command,
  Users,
  Package,
  Settings,
  Terminal,
  MessageSquare,
  UserX,
  UserMinus,
  UserCheck,
  Gift,
  MapPin,
  ListChecks,
  Code,
} from "lucide-react";

export function CommandTabs() {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full bg-white space-x-1 grid-cols-5 ">
        <TabsTrigger
          value="basic"
          className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
        >
          <Command size={18} className="transition-transform hover:rotate-12" />
          <span>Basic</span>
        </TabsTrigger>
        <TabsTrigger
          value="players"
          className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
        >
          <Users size={18} className="transition-transform hover:rotate-12" />
          <span>Players</span>
        </TabsTrigger>
        <TabsTrigger
          value="items"
          className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
        >
          <Package size={18} className="transition-transform hover:rotate-12" />
          <span>Items</span>
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
        >
          <Settings
            size={18}
            className="transition-transform hover:rotate-12"
          />
          <span>Settings</span>
        </TabsTrigger>
        <TabsTrigger
          value="advanced"
          className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
        >
          <Terminal
            size={18}
            className="transition-transform hover:rotate-12"
          />
          <span>Advanced</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="basic"
        className="mt-6 space-y-4 animate-in slide-in-from-left-8 duration-500"
      >
        <CommandCard
          title="Broadcast Message"
          description="Send a message to all players on the server"
          icon={MessageSquare}
        >
          <MessageForm />
        </CommandCard>
        <CommandCard
          title="List Online Players"
          description="Show all players currently connected to the server"
          icon={Users}
        >
          <PlayerForm action="list" />
        </CommandCard>
      </TabsContent>
      <TabsContent
        value="players"
        className="mt-6 space-y-4 animate-in slide-in-from-left-8 duration-500"
      >
        <CommandCard
          title="Kick Player"
          description="Remove a player from the server"
          icon={UserX}
        >
          <PlayerForm action="kick" />
        </CommandCard>
        <CommandCard
          title="Ban Player"
          description="Ban a player from the server"
          icon={UserMinus}
        >
          <PlayerForm action="ban" />
        </CommandCard>
        <CommandCard
          title="Pardon Player"
          description="Unban a previously banned player"
          icon={UserCheck}
        >
          <PlayerForm action="pardon" />
        </CommandCard>
      </TabsContent>
      <TabsContent
        value="items"
        className="mt-6 space-y-4 animate-in slide-in-from-left-8 duration-500"
      >
        <CommandCard
          title="Give Item"
          description="Give an item to a player"
          icon={Gift}
        >
          <PlayerForm action="give" />
        </CommandCard>
        <CommandCard
          title="Teleport Player"
          description="Teleport a player to a location or another player"
          icon={MapPin}
        >
          <PlayerForm action="teleport" />
        </CommandCard>
      </TabsContent>
      <TabsContent
        value="settings"
        className="mt-6 space-y-4 animate-in slide-in-from-left-8 duration-500"
      >
        <CommandCard
          title="Game Settings"
          description="Change game mode, weather, and time"
          icon={Settings}
        >
          <GameSettingsForm />
        </CommandCard>
        <CommandCard
          title="Whitelist Management"
          description="Manage the server whitelist"
          icon={ListChecks}
        >
          <WhitelistForm />
        </CommandCard>
      </TabsContent>
      <TabsContent
        value="advanced"
        className="mt-6 space-y-4 animate-in slide-in-from-left-8 duration-500"
      >
        <CommandCard
          title="Raw Command"
          description="Send a custom command to the server"
          icon={Code}
        >
          <RawCommandForm />
        </CommandCard>
      </TabsContent>
    </Tabs>
  );
}
