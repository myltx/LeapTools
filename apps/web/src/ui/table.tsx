"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  Table as NextUITable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";

export type TableColumn<T extends object> = {
  key: string;
  title: string;
  render?: (row: T) => ReactNode;
};

export type TableProps<T extends object> = {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  className?: string;
  style?: CSSProperties;
};

export function Table<T extends object>({ columns, rows, rowKey, className, style }: TableProps<T>) {
  return (
    <NextUITable
      aria-label="table"
      {...(className === undefined ? {} : { className })}
      {...(style === undefined ? {} : { style })}
    >
      <TableHeader columns={columns}>
        {(col) => <TableColumn key={col.key}>{col.title}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(row) => (
          <TableRow key={rowKey(row)}>
            {(columnKey) => {
              const col = columns.find((c) => c.key === String(columnKey));
              return <TableCell>{col?.render ? col.render(row) : (row as any)[String(columnKey)]}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </NextUITable>
  );
}
