"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogViewerProps {
  maxLines?: number;
}

export function LogViewer({ maxLines = 500 }: LogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Connect to log stream
  useEffect(() => {
    // Create EventSource for SSE connection
    const eventSource = new EventSource("/api/logs");
    eventSourceRef.current = eventSource;

    // Set up event handlers
    eventSource.onopen = () => {
      setIsConnected(true);
      setLogs((prev) => [...prev, "Connected to log stream..."]);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs((prev) => {
          const newLogs = [...prev, data.line];
          // Keep only the last maxLines
          return newLogs.slice(-maxLines);
        });
      } catch (error) {
        console.error("Error parsing log message:", error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      setLogs((prev) => [
        ...prev,
        "Disconnected from log stream. Attempting to reconnect...",
      ]);
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [maxLines]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Handle scroll events to detect manual scrolling
  const handleScroll = () => {
    if (!logContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
    // If scrolled near bottom (within 50px), re-enable auto-scroll
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

    if (isNearBottom !== autoScroll) {
      setAutoScroll(isNearBottom);
    }
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between bg-primary/5 px-4 py-2 rounded-t-md">
        <div className="flex items-center">
          <Terminal size={20} className="text-primary mr-2" />
          <h3 className="text-md font-medium text-primary">Server Logs</h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLogs}
            className="text-xs h-7"
          >
            Clear
          </Button>
        </div>
      </div>

      <div
        ref={logContainerRef}
        onScroll={handleScroll}
        className="font-mono text-xs bg-black text-green-400 p-4 rounded-b-md h-[400px] overflow-y-auto"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 italic">Waiting for logs...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap break-all">
              {log}
            </div>
          ))
        )}

        {!autoScroll && (
          <Button
            variant="outline"
            size="sm"
            className="absolute right-8 bottom-8 bg-black/80 text-white border-gray-700"
            onClick={() => {
              setAutoScroll(true);
              if (logContainerRef.current) {
                logContainerRef.current.scrollTop =
                  logContainerRef.current.scrollHeight;
              }
            }}
          >
            Scroll to Bottom
          </Button>
        )}
      </div>
    </div>
  );
}
