"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Category } from "@/types/api";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
  isLoading = false,
}: DeleteCategoryDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione non può essere annullata. Verrà eliminata
            permanentemente la categoria{" "}
            <span className="font-semibold">&quot;{category?.name}&quot;</span>{" "}
            e rimossa da tutti i servizi associati.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annulla</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Eliminazione in corso..." : "Elimina"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
