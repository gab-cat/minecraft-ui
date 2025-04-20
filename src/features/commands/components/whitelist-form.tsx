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
import { manageWhitelist } from "../actions";
import { whitelistSchema } from "../schema";
import ServerResponse from "@/components/shared/server-response";

export function WhitelistForm() {
  const [response, setResponse] = useState<string | null>(null);

  const form = useForm<z.infer<typeof whitelistSchema>>({
    resolver: zodResolver(whitelistSchema),
    defaultValues: {
      action: "list",
      player: "",
    },
  });

  const watchAction = form.watch("action");
  const needsPlayer = ["add", "remove"].includes(watchAction);

  const mutation = useMutation({
    mutationFn: manageWhitelist,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Whitelist action completed successfully`);
        setResponse(data.message!);
        if (["add", "remove"].includes(watchAction)) {
          form.setValue("player", "");
        }
      } else {
        toast.error(data.error || "Whitelist action failed");
      }
    },
    onError: (error) => {
      toast.error(`An error occurred while managing whitelist`);
      console.error(error);
    },
  });

  const onSubmit = (data: z.infer<typeof whitelistSchema>) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="list">List whitelist</SelectItem>
                    <SelectItem value="add">Add player</SelectItem>
                    <SelectItem value="remove">Remove player</SelectItem>
                    <SelectItem value="on">Enable whitelist</SelectItem>
                    <SelectItem value="off">Disable whitelist</SelectItem>
                    <SelectItem value="reload">Reload whitelist</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {needsPlayer && (
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
          )}

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Processing..." : "Execute Whitelist Command"}
          </Button>
        </form>
      </Form>

      {response && <ServerResponse response={response} />}
    </div>
  );
}
