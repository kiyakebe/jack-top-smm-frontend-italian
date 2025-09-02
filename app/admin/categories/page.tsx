"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryForm } from "@/components/categories/category-form";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import { CategoriesTable } from "@/components/categories/categories-table";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type CategoryFormData,
} from "@/hooks/use-categories";
import { Category } from "@/types/api";

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const { data: categories, isLoading } = useCategories();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleCreateCategory = (data: CategoryFormData) => {
    createCategoryMutation.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
        setSelectedCategory(undefined);
      },
    });
  };

  const handleUpdateCategory = (data: CategoryFormData) => {
    if (!selectedCategory) return;

    updateCategoryMutation.mutate(
      { id: selectedCategory._id, data },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          setSelectedCategory(undefined);
        },
      }
    );
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;

    deleteCategoryMutation.mutate(selectedCategory._id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedCategory(undefined);
      },
    });
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedCategory(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage service categories for your SMM panel
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            A list of all categories in your system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : (
            <CategoriesTable
              categories={categories || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <CategoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={selectedCategory}
        onSubmit={
          selectedCategory ? handleUpdateCategory : handleCreateCategory
        }
        isLoading={
          createCategoryMutation.isPending || updateCategoryMutation.isPending
        }
      />

      {selectedCategory && (
        <DeleteCategoryDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          category={selectedCategory}
          onConfirm={handleDeleteCategory}
          isLoading={deleteCategoryMutation.isPending}
        />
      )}
    </div>
  );
}
