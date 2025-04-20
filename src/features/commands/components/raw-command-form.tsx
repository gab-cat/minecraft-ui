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
import { Textarea } from "@/components/ui/textarea";
import { executeRawCommand } from "../actions";
import { rawCommandSchema } from "../schema";
import ServerResponse from "@/components/shared/server-response";

export function RawCommandForm() {
  const [response, setResponse] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const form = useForm<z.infer<typeof rawCommandSchema>>({
    resolver: zodResolver(rawCommandSchema),
    defaultValues: {
      command: "",
    },
  });

  const mutation = useMutation({
    mutationFn: executeRawCommand,
    onSuccess: (data) => {
      if (data.success) {
        const command = form.getValues("command");
        toast.success("Command executed successfully");
        setResponse(data.message!);

        // Add to command history
        if (command && !commandHistory.includes(command)) {
          setCommandHistory((prev) => [command, ...prev].slice(0, 10));
        }

        form.reset();
      } else {
        toast.error(data.error || "Command execution failed");
      }
    },
    onError: (error) => {
      toast.error("An error occurred while executing the command");
      console.error(error);
    },
  });

  const onSubmit = (data: z.infer<typeof rawCommandSchema>) => {
    mutation.mutate(data);
  };

  const useHistoryCommand = (command: string) => {
    form.setValue("command", command);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="command"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Command</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a raw Minecraft command (e.g., 'help', 'difficulty peaceful')"
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Executing..." : "Execute Command"}
          </Button>
        </form>
      </Form>

      {response && <ServerResponse response={response} />}

      {commandHistory.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 font-medium">Command History:</h4>
          <div className="space-y-2">
            {commandHistory.map((cmd, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="mr-2 mb-2 font-mono text-xs"
                // eslint-disable-next-line react-hooks/rules-of-hooks
                onClick={() => useHistoryCommand(cmd)}
              >
                {cmd}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
