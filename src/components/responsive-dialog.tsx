"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";

import { Dialog } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveDialogProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ResponsiveDialog({
  title,
  description,
  children,
  open,
  onOpenChange,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerClose className="absolute right-3 top-3 text-gray-600">✕</DrawerClose>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>

          <div className="p-4">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return <></>; // Desktop doesn’t use this dialog anymore
}
