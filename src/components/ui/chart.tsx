"use client";

import * as React from "react";
import { ResponsiveContainer } from "recharts";

import { cn } from "@/lib/utils";

// Chart configuration type
const ChartConfig = {} as Record<string, unknown>;

// Chart Container Component
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: Record<string, unknown>;
    children: React.ComponentProps<typeof ResponsiveContainer>["children"];
  }
>(({ id, className, children, ...props }, ref) => {
  return (
    <div
      data-chart={id}
      ref={ref}
      className={cn(
        "flex w-full h-full min-h-0 justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className
      )}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
});
ChartContainer.displayName = "ChartContainer";

// Chart Tooltip Component
const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-background p-2 text-sm shadow-md",
        className
      )}
      {...props}
    />
  );
});
ChartTooltip.displayName = "ChartTooltip";

// Chart Tooltip Content Component
const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: unknown;
      payload: unknown;
    }>;
    label?: string;
  }
>(({ active, payload, label, className, ...props }, ref) => {
  if (active && payload && payload.length) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background p-2 text-sm shadow-md",
          className
        )}
        {...props}
      >
        <div className="grid gap-2">
          <div className="font-medium">{label}</div>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: "#8884d8",
                }}
              />
              <span className="text-muted-foreground">{entry.dataKey}:</span>
              <span className="font-medium">{String(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
});
ChartTooltipContent.displayName = "ChartTooltipContent";

export { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent };
