"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RocketIcon } from "lucide-react";
import Link from "next/link";

export const DashboardTrial = () => {
  // Dummy data (no backend)
  const agentCount = 3;
  const maxFreeAgents = 5;

  const meetingCount = 7;
  const maxFreeMeetings = 10;

  const agentPercent = (agentCount / maxFreeAgents) * 100;
  const meetingPercent = (meetingCount / maxFreeMeetings) * 100;

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm flex flex-col">
      <div className="p-4 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center gap-2">
          <RocketIcon className="size-4 text-primary" />
          <p className="text-sm font-medium text-primary">Free Trial</p>
        </div>

        {/* Agents */}
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            {agentCount}/{maxFreeAgents} Agents
          </p>
          <Progress value={agentPercent} className="h-2" />
        </div>

        {/* Predictions (instead of meetings, for TickerTribe) */}
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            {meetingCount}/{maxFreeMeetings} Predictions
          </p>
          <Progress value={meetingPercent} className="h-2" />
        </div>
      </div>

      {/* Upgrade button */}
      <Button
        asChild
        className="rounded-t-none border-t border-border text-black bg-white hover:bg-muted"
      >
        <Link href="/upgrade">Upgrade</Link>
      </Button>
    </div>
  );
};
