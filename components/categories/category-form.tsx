"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createCategorySchema, updateCategorySchema } from "@/schemas/category";
import type {
  CreateCategoryFormData,
  UpdateCategoryFormData,
} from "@/schemas/category";
import { Category } from "@/types/api";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSubmit: (data: CreateCategoryFormData | UpdateCategoryFormData) => void;
  isLoading?: boolean;
}

export function CategoryForm({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading = false,
}: CategoryFormProps) {
  const isEditing = !!category;
  const schema = isEditing ? updateCategorySchema : createCategorySchema;

  const form = useForm<CreateCategoryFormData | UpdateCategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  const handleSubmit = (
    data: CreateCategoryFormData | UpdateCategoryFormData
  ) => {
    onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica Categoria" : "Crea Nuova Categoria"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Aggiorna le informazioni della categoria qui sotto."
              : "Aggiungi una nuova categoria per organizzare i tuoi servizi."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Categoria</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Inserisci il nome della categoria"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading
                  ? "Salvataggio in corso..."
                  : isEditing
                  ? "Aggiorna"
                  : "Crea"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
