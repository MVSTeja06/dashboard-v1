"use client";

import { IconBrightness } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { useThemeToggle } from "@/hooks/use-theme-toggle";

export function ThemeToggle() {

  const {handleThemeToggle} = useThemeToggle();

  return (
    <Button
      onClick={handleThemeToggle}
      variant="ghost"
      size="sm"
      className="p-[0]! h-6" 
    >
      <IconBrightness />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
