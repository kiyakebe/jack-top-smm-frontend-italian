"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCreateService, useOriginalServices } from "@/hooks/use-services";
import { useCategories } from "@/hooks/use-categories";
import type { Category, OriginalService } from "@/types/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the schema using zod
const serviceSchema = z.object({
  serviceName: z.string().min(1, "Il nome del servizio è obbligatorio"),
  newServiceName: z
    .string()
    .min(1, "Il nome del nuovo servizio è obbligatorio"),
  rate: z.number().min(0, "Il prezzo è obbligatorio"),
  category: z.string().min(1, "La categoria è obbligatoria"),
  min: z
    .string()
    .min(1, "La quantità minima è obbligatoria")
    .regex(/^\d+$/, "Deve essere un numero valido"),
  max: z
    .string()
    .min(1, "La quantità massima è obbligatoria")
    .regex(/^\d+$/, "Deve essere un numero valido"),
  type: z.string().min(1, "Il tipo è obbligatorio"),
  dripfeed: z.boolean(),
  refill: z.boolean(),
  cancel: z.boolean(),
  isActive: z.boolean(),
  isFree: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const AddService = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOriginal, setSelectedOriginal] =
    useState<OriginalService | null>(null);
  const createService = useCreateService();
  const { data: originalServices = [] } = useOriginalServices();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    console.log(JSON.stringify(selectedOriginal, null, 2));
  }, [selectedOriginal]);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: "",
      newServiceName: "",
      rate: 0,
      category: "",
      min: "",
      max: "",
      type: "default",
      dripfeed: false,
      refill: false,
      cancel: false,
      isActive: true,
      isFree: false,
    },
  });

  const filteredOptions = form.watch("serviceName")
    ? originalServices.filter((os) =>
        os.name.toLowerCase().includes(form.watch("serviceName").toLowerCase())
      )
    : originalServices;

  const handleSelectService = (os: OriginalService) => {
    form.setValue("serviceName", os.name);
    setSelectedOriginal(os);
    form.setValue("rate", Number(os.rate));
    form.setValue("min", os.min.toString());
    form.setValue("max", os.max.toString());
    form.setValue("type", os.type);
    form.setValue("dripfeed", os.dripfeed);
    form.setValue("refill", os.refill);
    form.setValue("cancel", os.cancel);
  };

  const handleCreateService = async (data: ServiceFormData) => {
    if (!selectedOriginal) return;
    const serviceData = {
      type: data.type,
      service: Number(selectedOriginal.service),
      name: data.newServiceName,
      rate: data.rate,
      min: Number(data.min),
      max: Number(data.max),
      dripfeed: data.dripfeed,
      refill: data.refill,
      cancel: data.cancel,
      category: data.category,
      original: {
        name: selectedOriginal.name,
        rate: Number(selectedOriginal.rate),
        category: selectedOriginal.category,
      },
      isActive: data.isActive,
      isFree: data.isFree,
    };
    await createService.mutateAsync(serviceData);
    setIsCreateDialogOpen(false);
    setSelectedOriginal(null);
    form.reset();
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Aggiungi Servizio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crea Nuovo Servizio</DialogTitle>
          <DialogDescription>
            Aggiungi un nuovo servizio alla piattaforma
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateService)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Servizio Originale</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedOriginal(null);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value &&
                    filteredOptions.length > 0 &&
                    !selectedOriginal && (
                      <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
                        {filteredOptions.slice(0, 10).map((os) => (
                          <li
                            key={os.service}
                            className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                            onClick={() => handleSelectService(os)}
                          >
                            <span className="font-medium">{os.name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              ID: {os.service}
                            </span>
                            <span className="ml-2 text-xs text-blue-600">
                              ${os.rate}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newServiceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Nuovo Servizio</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={0.01}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                        disabled={form.watch("isFree")}
                        className={form.watch("isFree") ? "opacity-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                    {form.watch("isFree") && (
                      <p className="text-xs text-blue-600 mt-1">
                        Il prezzo viene impostato automaticamente a 0 per i
                        servizi gratuiti
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona una categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat: Category, index) => (
                          <SelectItem key={index} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantità Minima</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                    {selectedOriginal && (
                      <p className="text-xs text-gray-500 mt-1">
                        Originale: {selectedOriginal.min}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantità Massima</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                    {selectedOriginal && (
                      <p className="text-xs text-gray-500 mt-1">
                        Originale: {selectedOriginal.max}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) form.setValue("rate", 0);
                        }}
                      />
                    </FormControl>
                    <FormLabel>Gratuito</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Attivo</FormLabel>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={createService.isPending}
            >
              Crea Servizio
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddService;
