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
import { Trash2 } from "lucide-react";
import type { Service } from "@/types/api";

interface DeleteServiceDialogProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function DeleteServiceDialog({
  service,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteServiceDialogProps) {
  if (!service) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Elimina Servizio
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare{" "}
            <span className="font-semibold">{service.name}</span>? Questa azione
            non può essere annullata e rimuoverà permanentemente il servizio dal
            sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annulla</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Eliminazione..." : "Elimina Servizio"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
