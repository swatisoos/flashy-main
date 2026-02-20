import * as React from "react";

import { cn } from "@/lib/utils";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface TagsInputProps {
  initialTags?: string[];
  className?: string;
  onChange?: (tags: string[]) => void;
}

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  ({ className, initialTags, onChange }, ref) => {
    const [tags, setTags] = useState<string[]>(initialTags || []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        const target = event.currentTarget as HTMLInputElement;
        if (target.value.trim() !== "") {
          setTags([...tags, target.value.trim()]);
          onChange && onChange([...tags, target.value.trim()]);
          target.value = "";
        }
      }
    };

    const removeTag = (index: number) => {
      setTags(tags.filter((_: string, i: number) => i !== index));
      onChange && onChange(tags.filter((_: string, i: number) => i !== index));
    };

    return (
      <div
        className={cn(
          "h-auto gap-y-2 flex flex-wrap w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[--clr_text]",
          className,
        )}
      >
        {tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="mr-2 bg-gray-200 bg-opacity-15 rounded-2xl px-2 py-1 text-sm flex items-center"
          >
            {tag}
            <Button variant="ghost" className="p-0 h-auto ml-2">
              <XCircle size={12} onClick={() => removeTag(index)} />
            </Button>
          </span>
        ))}
        <input
          className="flex-1 outline-none bg-background w-inherit h-fit pt-1"
          onKeyDown={handleKeyDown}
          ref={ref}
        />
      </div>
    );
  },
);

TagsInput.displayName = "TagsInput";

export { TagsInput };
