"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateOrderFormValues, createOrderSchema } from "@/schemas/order";
import { useCreateOrder } from "@/hooks/use-orders";
import { useServices } from "@/hooks/use-services";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddNewOrderWithService() {
  const { data: services = [], isLoading } = useServices();
  const createOrder = useCreateOrder();
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      type: "default",
    },
  });

  React.useEffect(() => {
    return () => {
      form.clearErrors("root");
    };
  }, [form]);

  const selectedType = form.watch("type");
  const selectedServiceId = form.watch("serviceId");
  const selectedService = services.find(
    (service) => service._id === selectedServiceId
  );
  const isFree = selectedService?.isFree || false;

  async function onSubmit(values: CreateOrderFormValues) {
    try {
      await createOrder.mutateAsync(values);
      form.reset({
        type: "default",
      });
    } catch (error) {
      console.log(error);
      form.setError("root", {
        type: "manual",
        message: "Creazione ordine fallita",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servizio</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value ? value : "");
                  form.setValue("quantity", 0);
                }}
                value={field.value?.toString() || ""}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoading ? "Caricamento servizi..." : "Seleziona un servizio"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service, index) => (
                    <SelectItem key={index} value={service._id}>
                      {`${service.name} (Tariffa: ${service.rate})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {(selectedType === "default" ||
          selectedType === "package" ||
          selectedType === "custom_comments" ||
          selectedType === "mentions_with_hashtags" ||
          selectedType === "mentions_hashtag" ||
          selectedType === "comment_likes" ||
          selectedType === "poll" ||
          selectedType === "comment_replies") && (
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isFree ? "Nome utente" : "Link"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={isFree ? "nomeutente" : "https://esempio.com"}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(selectedType === "default" ||
          selectedType === "mentions_with_hashtags" ||
          selectedType === "mentions_hashtag" ||
          selectedType === "comment_likes" ||
          selectedType === "poll") && (
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Quantità (Min: {selectedService?.min} e Max: {selectedService?.max})
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={
                      selectedService
                        ? `Min: ${selectedService.min} e Max ${selectedService.max}`
                        : "Seleziona prima un servizio"
                    }
                    min={selectedService?.min}
                    max={selectedService?.max}
                    disabled={!selectedService}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedType === "default" && !isFree && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="runs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Esecuzioni (Opzionale)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          Number.parseInt(e.target.value) || undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervallo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={createOrder.isPending || isLoading || !selectedService}
        >
          {createOrder.isPending ? "Creazione ordine..." : "Crea ordine"}
        </Button>
      </form>
    </Form>
  );
}
