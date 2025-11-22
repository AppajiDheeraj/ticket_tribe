"use client";

import { useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export const MultiStepModal = RadixDialog.Root;
export const MultiStepModalTrigger = RadixDialog.Trigger;

type Step = {
  title: string;
  description: string;
  progress?: string;
  content?: React.ReactNode;
};

export function MultiStepModalContent({
  steps,
  ...props
}: {
  steps: Step[];
} & React.ComponentPropsWithoutRef<typeof RadixDialog.Content>) {
  const [index, setIndex] = useState(0);

  const step = steps[index];
  const TOTAL = steps.length;

  const next = () => {
    if (index < TOTAL - 1) setIndex(index + 1);
  };

  const back = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <RadixDialog.Portal>
      {/* Overlay */}
      <RadixDialog.Overlay className="fixed inset-0 bg-black/50 z-[900]" />

      {/* Content */}
      <RadixDialog.Content
        {...props}
        onInteractOutside={(e) => e.preventDefault()}
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[95%] max-w-md rounded-xl border bg-white shadow-xl z-[9999]",
          "focus:outline-none p-0"
        )}
      >
        {/* Header */}
        <div className="p-5 border-b">
          <p className="text-xs text-muted-foreground">{step.progress}</p>
          <h1 className="text-lg font-semibold mt-1">{step.title}</h1>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </div>

        {/* Body */}
        <div className="p-5">{step.content}</div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={back}
            className="w-24"
          >
            Back
          </Button>

          <Button
            disabled={index === TOTAL - 1}
            onClick={next}
            className="w-24"
          >
            Continue
          </Button>
        </div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
