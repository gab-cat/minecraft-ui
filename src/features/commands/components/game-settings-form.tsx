"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeGamemode, changeWeather, changeTime } from "../actions";
import { gamemodeSchema, weatherSchema, timeSchema } from "../schema";
import {
  Gamepad2,
  Cloud,
  Clock,
  Sun,
  CloudRain,
  CloudLightning,
  SunMedium,
  Moon,
} from "lucide-react";
import ServerResponse from "@/components/shared/server-response";

type SettingType = "gamemode" | "weather" | "time";

export function GameSettingsForm() {
  const [settingType, setSettingType] = useState<SettingType>("gamemode");
  const [response, setResponse] = useState<string | null>(null);

  // Define form schema based on setting type
  const getFormSchema = () => {
    switch (settingType) {
      case "gamemode":
        return gamemodeSchema;
      case "weather":
        return weatherSchema;
      case "time":
        return timeSchema;
      default:
        return z.object({});
    }
  };

  const form = useForm({
    resolver: zodResolver(getFormSchema()),
    defaultValues: {
      player: "",
      mode: "survival",
      type: "clear",
      setting: "day",
    },
  });

  // Reset form when setting type changes
  const handleSettingTypeChange = (value: SettingType) => {
    setSettingType(value);
    form.reset({
      player: "",
      mode: "survival",
      type: "clear",
      setting: "day",
    });
  };

  const getActionFunction = () => {
    switch (settingType) {
      case "gamemode":
        return changeGamemode;
      case "weather":
        return changeWeather;
      case "time":
        return changeTime;
      default:
        return async () => ({ success: false, error: "Invalid setting type" });
    }
  };

  // Use different types based on the setting type
  type MutationData =
    | {
        mode: "survival" | "creative" | "adventure" | "spectator";
        player: string;
      }
    | { type: "clear" | "rain" | "thunder" }
    | { setting: "day" | "night" }
    | Record<string, never>;

  const mutation = useMutation<
    { success: boolean; message?: string; error?: string },
    Error,
    MutationData
  >({
    mutationFn: async (data) => {
      const actionFn = getActionFunction();
      return actionFn(data as any);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Game setting changed successfully`);
        if (data.message) setResponse(data.message);
      } else {
        toast.error(data.error || "Command failed");
      }
    },
    onError: (error) => {
      toast.error(`An error occurred while changing game settings`);
      console.error(error);
    },
  });

  const onSubmit = (data: MutationData) => {
    mutation.mutate(data);
  };

  // Get the icon component based on setting type
  const getSettingIcon = (type: SettingType) => {
    switch (type) {
      case "gamemode":
        return <Gamepad2 size={24} className="text-primary" />;
      case "weather":
        return <Cloud size={24} className="text-primary" />;
      case "time":
        return <Clock size={24} className="text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 bg-primary/5 p-1 rounded-md">
        <Button
          variant={settingType === "gamemode" ? "default" : "ghost"}
          onClick={() => handleSettingTypeChange("gamemode")}
          className={`flex-1 ${
            settingType === "gamemode"
              ? "bg-primary text-white"
              : "text-primary hover:text-primary"
          }`}
        >
          <Gamepad2 size={20} className="mr-2" />
          Game Mode
        </Button>
        <Button
          variant={settingType === "weather" ? "default" : "ghost"}
          onClick={() => handleSettingTypeChange("weather")}
          className={`flex-1 ${
            settingType === "weather"
              ? "bg-primary text-white"
              : "text-primary hover:text-primary"
          }`}
        >
          <Cloud size={20} className="mr-2" />
          Weather
        </Button>
        <Button
          variant={settingType === "time" ? "default" : "ghost"}
          onClick={() => handleSettingTypeChange("time")}
          className={`flex-1 ${
            settingType === "time"
              ? "bg-primary text-white"
              : "text-primary hover:text-primary"
          }`}
        >
          <Clock size={20} className="mr-2" />
          Time
        </Button>
      </div>
      <div className="bg-white/80 backdrop-blur-sm border border-border/60 rounded-md p-5">
        <div className="flex items-center mb-4">
          {getSettingIcon(settingType)}
          <h3 className="text-lg font-medium capitalize text-primary ml-2">
            {settingType} Settings
          </h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {settingType === "gamemode" && (
              <>
                <FormField
                  control={form.control}
                  name="player"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">
                        Player
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Player username"
                          {...field}
                          className="border-primary/20 focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">
                        Game Mode
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-primary/20 focus-visible:ring-primary">
                            <SelectValue placeholder="Select game mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="survival">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              Survival
                            </div>
                          </SelectItem>
                          <SelectItem value="creative">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                              Creative
                            </div>
                          </SelectItem>
                          <SelectItem value="adventure">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                              Adventure
                            </div>
                          </SelectItem>
                          <SelectItem value="spectator">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                              Spectator
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {settingType === "weather" && (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      Weather Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-primary/20 focus-visible:ring-primary">
                          <SelectValue placeholder="Select weather type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="clear">
                          <div className="flex items-center">
                            <Sun size={16} className="mr-2 text-amber-500" />
                            Clear
                          </div>
                        </SelectItem>
                        <SelectItem value="rain">
                          <div className="flex items-center">
                            <CloudRain
                              size={16}
                              className="mr-2 text-blue-500"
                            />
                            Rain
                          </div>
                        </SelectItem>
                        <SelectItem value="thunder">
                          <div className="flex items-center">
                            <CloudLightning
                              size={16}
                              className="mr-2 text-purple-500"
                            />
                            Thunder
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {settingType === "time" && (
              <FormField
                control={form.control}
                name="setting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      Time Setting
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-primary/20 focus-visible:ring-primary">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="day">
                          <div className="flex items-center">
                            <SunMedium
                              size={16}
                              className="mr-2 text-amber-500"
                            />
                            Day
                          </div>
                        </SelectItem>
                        <SelectItem value="night">
                          <div className="flex items-center">
                            <Moon size={16} className="mr-2 text-indigo-500" />
                            Night
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {mutation.isPending
                ? "Applying..."
                : `Apply ${
                    settingType.charAt(0).toUpperCase() + settingType.slice(1)
                  } Setting`}
            </Button>
          </form>
        </Form>
      </div>
      {response && <ServerResponse response={response} />}
    </div>
  );
}
