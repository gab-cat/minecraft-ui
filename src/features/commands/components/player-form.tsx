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
import { Textarea } from "@/components/ui/textarea";
import {
  kickPlayer,
  banPlayer,
  pardonPlayer,
  giveItem,
  teleportPlayer,
  getOnlinePlayers,
} from "../actions";
import { playerActionSchema, giveItemSchema, teleportSchema } from "../schema";
import ServerResponse from "@/components/shared/server-response";

type PlayerAction = "kick" | "ban" | "pardon" | "give" | "teleport" | "list";
type FormData =
  | z.infer<typeof playerActionSchema>
  | z.infer<typeof giveItemSchema>
  | z.infer<typeof teleportSchema>
  | Record<string, never>;

export function PlayerForm({ action }: { action: PlayerAction }) {
  const [response, setResponse] = useState<string | null>(null);

  // Define form schema based on action
  const getFormSchema = () => {
    switch (action) {
      case "kick":
      case "ban":
        return playerActionSchema;
      case "pardon":
        return z.object({
          player: z.string().min(1, "Player name is required"),
        });
      case "give":
        return giveItemSchema;
      case "teleport":
        return teleportSchema;
      case "list":
        return z.object({});
      default:
        return z.object({});
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(getFormSchema()),
    defaultValues:
      action === "give"
        ? { player: "", item: "", amount: 1 }
        : action === "teleport"
        ? { target: "", destination: "" }
        : { player: "", reason: "" },
  });

  const getActionFunction = () => {
    switch (action) {
      case "kick":
        return kickPlayer;
      case "ban":
        return banPlayer;
      case "pardon":
        return pardonPlayer;
      case "give":
        return giveItem;
      case "teleport":
        return teleportPlayer;
      case "list":
        return getOnlinePlayers;
      default:
        return async () => ({ success: false, error: "Invalid action" });
    }
  };

  const getActionTitle = () => {
    switch (action) {
      case "kick":
        return "Kicking";
      case "ban":
        return "Banning";
      case "pardon":
        return "Pardoning";
      case "give":
        return "Giving";
      case "teleport":
        return "Teleporting";
      case "list":
        return "Getting";
      default:
        return "Processing";
    }
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const fn = getActionFunction();
      // Type assertion to match the expected parameter type of the specific function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return fn(data as any);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`${getActionTitle()} completed successfully`);
        setResponse(data.message!);
        form.reset();
      } else {
        toast.error(data.error || "Command failed");
      }
    },
    onError: (error) => {
      toast.error(`An error occurred while ${action}`);
      console.error(error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const handleListPlayers = () => {
    mutation.mutate({});
  };

  if (action === "list") {
    return (
      <div className="space-y-4">
        <Button
          onClick={handleListPlayers}
          disabled={mutation.isPending}
          className="w-full"
        >
          {mutation.isPending ? "Getting Players..." : "List Online Players"}
        </Button>

        {response && <ServerResponse response={response} />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {action === "teleport" ? (
            <>
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Player</FormLabel>
                    <FormControl>
                      <Input placeholder="Player username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Player name or coordinates"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : action === "give" ? (
            <>
              <FormField
                control={form.control}
                name="player"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player</FormLabel>
                    <FormControl>
                      <Input placeholder="Player username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Item name (e.g., diamond_sword)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="player"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player</FormLabel>
                    <FormControl>
                      <Input placeholder="Player username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(action === "kick" || action === "ban") && (
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Reason for action" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending
              ? `${getActionTitle()}...`
              : `${action.charAt(0).toUpperCase() + action.slice(1)} ${
                  action === "teleport"
                    ? "Player"
                    : action === "give"
                    ? "Item"
                    : "Player"
                }`}
          </Button>
        </form>
      </Form>

      {response && <ServerResponse response={response} />}
    </div>
  );
}
