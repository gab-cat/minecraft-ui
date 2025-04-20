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
import { sendMessageSchema } from "@/features/commands/schema";
import { sendMessage } from "../actions";
import ServerResponse from "@/components/shared/server-response";

type FormData = z.infer<typeof sendMessageSchema>;

export function MessageForm() {
  const [response, setResponse] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Message sent successfully");
        setResponse(data.message!);
        form.reset();
      } else {
        toast.error(data.error || "Failed to send message");
      }
    },
    onError: (error) => {
      toast.error("An error occurred while sending the message");
      console.error(error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Input placeholder="Enter message to broadcast" {...field} />
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
            {mutation.isPending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>

      {response && <ServerResponse response={response} />}
    </div>
  );
}
