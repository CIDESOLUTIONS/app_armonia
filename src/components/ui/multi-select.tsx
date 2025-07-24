
"use client";

import * as React from "react";
import { X, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Option = Record<"value" | "label", string>;

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onSelectChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onSelectChange,
  placeholder = "Seleccionar...",
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((option: Option) => {
    onSelectChange(selected.filter((s) => s !== option.value));
  }, [selected, onSelectChange]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          onSelectChange(selected.slice(0, -1));
        }
      }
      // This is not a perfect solution, but it is a good start.
      // Add your own keydown handlers for your use case.
    }
  }, [selected, onSelectChange]);

  const selectables = options.filter(
    (option) => !selected.includes(option.value),
  );

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <div className="flex flex-wrap gap-1">
              {selected.map((value) => {
                const option = options.find((o) => o.value === value);
                return (
                  option && (
                    <Badge key={value} variant="secondary">
                      {option.label}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => handleUnselect(option)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  )
                );
              })}
              <CommandPrimitive.Input
                ref={inputRef}
                value={inputValue}
                onValueChange={setInputValue}
                onBlur={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={() => {
                      setInputValue("");
                      onSelectChange([...selected, option.value]);
                    }}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </Command>
  );
}
