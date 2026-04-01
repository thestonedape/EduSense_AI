import { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DataTableProps<T> = {
  title: string;
  columns: string[];
  rows: T[];
  renderRow: (row: T, index: number) => ReactNode;
};

export function DataTable<T>({ title, columns, rows, renderRow }: DataTableProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{rows.map((row, index) => renderRow(row, index))}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
