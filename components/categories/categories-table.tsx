"use client";
import { format } from "date-fns";
import { Edit, Trash2, Ungroup } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types/api";
import { EmptyState } from "../EmpityState";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right max-w-10">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-muted-foreground"
              >
                <EmptyState
                  icon={Ungroup}
                  title="No category created yet"
                  description="There are no categories to display at the moment."
                />
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  {format(new Date(category.createdAt), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  {format(new Date(category.updatedAt), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
