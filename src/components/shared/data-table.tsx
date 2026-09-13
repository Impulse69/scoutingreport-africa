import Link from "next/link";
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/shared/utils";

export type Column<TRow> = {
  key: string;
  header: ReactNode;
  cell: (row: TRow) => ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
};

type DataTableProps<TRow> = {
  rows: TRow[];
  columns: Column<TRow>[];
  rowKey: (row: TRow) => string;
  rowHref?: (row: TRow) => string | null | undefined;
  empty?: { title: string; description?: string };
  className?: string;
};

const alignClasses = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable<TRow>({
  rows,
  columns,
  rowKey,
  rowHref,
  empty,
  className,
}: DataTableProps<TRow>) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={empty?.title ?? "No data yet"}
        description={empty?.description}
      />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "text-xs font-medium text-muted-foreground",
                  col.align ? alignClasses[col.align] : alignClasses.left,
                  col.className,
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const href = rowHref?.(row);
            const rowEl = (
              <TableRow
                key={rowKey(row)}
                className={cn(href ? "cursor-pointer" : undefined)}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      col.align ? alignClasses[col.align] : alignClasses.left,
                      col.className,
                    )}
                  >
                    {href ? (
                      <Link href={href} className="block w-full">
                        {col.cell(row)}
                      </Link>
                    ) : (
                      col.cell(row)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
            return rowEl;
          })}
        </TableBody>
      </Table>
    </div>
  );
}
