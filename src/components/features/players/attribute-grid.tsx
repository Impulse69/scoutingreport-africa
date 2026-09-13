import React from "react";
import { cn } from "@/lib/shared/utils";

interface Attribute {
  name: string;
  value: number;
}

interface AttributeGroup {
  category: string;
  attributes: Attribute[];
}

interface AttributeGridProps {
  groups: AttributeGroup[];
}

export function AttributeGrid({ groups }: AttributeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {groups.map((group) => (
        <div key={group.category} className="space-y-4">
          <h3 className="text-sm font-bold  tracking-normal text-muted-foreground border-b border-border pb-2">
            {group.category}
          </h3>
          <div className="space-y-2">
            {group.attributes.map((attr) => (
              <div key={attr.name} className="flex items-center justify-between group">
                <span className="text-sm text-muted-foreground group-hover:text-muted-foreground transition-colors">
                  {attr.name}
                </span>
                <RatingBadge value={attr.value} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RatingBadge({ value }: { value: number }) {
  const getRatingColor = (v: number) => {
    if (v >= 16) return "bg-primary text-primary-foreground";
    if (v >= 13) return "bg-primary text-primary-foreground";
    if (v >= 10) return "bg-muted text-primary";
    if (v >= 7) return "bg-muted text-muted-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className={cn(
      "w-8 h-8 flex items-center justify-center rounded text-sm font-bold shadow-sm transition-transform hover:scale-110",
      getRatingColor(value)
    )}>
      {value}
    </div>
  );
}
