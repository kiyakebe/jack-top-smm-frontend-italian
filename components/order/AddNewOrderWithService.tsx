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

  // Clear root error when the form is unmounted (modal closed)
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
        message: "Failed to create order",
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
              <FormLabel>Service</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value ? value : "");
                  // Reset quantity when service changes to avoid invalid values
                  form.setValue("quantity", 0);
                }}
                value={field.value?.toString() || ""}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoading ? "Loading services..." : "Select a service"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service, index) => (
                    <SelectItem key={index} value={service._id}>
                      {`${service.name} (Rate: ${service.rate})`}
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
                <FormLabel>{isFree ? "Username" : "Link"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={isFree ? "username" : "https://example.com"}
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
          <>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (Min: {selectedService?.min} and Max: {selectedService?.max})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        selectedService
                          ? `Min: ${selectedService.min} and Max ${selectedService.max}`
                          : "Select a service first"
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
          </>
        )}
        {selectedType === "default" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="runs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Runs (Optional)</FormLabel>
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
                  <FormLabel>Interval</FormLabel>
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
        {(selectedType === "custom_comments" ||
          selectedType === "comment_replies") && (
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your comments here..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {selectedType === "mentions_with_hashtags" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="usernames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usernames</FormLabel>
                  <FormControl>
                    <Input placeholder="@user1, @user2" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of usernames
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hashtags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hashtags</FormLabel>
                  <FormControl>
                    <Input placeholder="#tag1, #tag2" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of hashtags
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        {selectedType === "mentions_hashtag" && (
          <FormField
            control={form.control}
            name="hashtag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hashtag</FormLabel>
                <FormControl>
                  <Input placeholder="#hashtag" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {selectedType === "subscriptions" && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="@username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum</FormLabel>
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
              <FormField
                control={form.control}
                name="max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum</FormLabel>
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
              <FormField
                control={form.control}
                name="delay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delay (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        max={600}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>0-600 minutes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="posts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posts (Optional)</FormLabel>
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
                name="old_posts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Posts (Optional)</FormLabel>
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
                name="expiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="dd/mm/yyyy" {...field} />
                    </FormControl>
                    <FormDescription>Format: dd/mm/yyyy</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        {(selectedType === "comment_likes" ||
          selectedType === "comment_replies") && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="@username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {selectedType === "poll" && (
          <FormField
            control={form.control}
            name="answer_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer Number</FormLabel>
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
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={createOrder.isPending || isLoading || !selectedService}
        >
          {createOrder.isPending ? "Creating Order" : "Create Order"}
        </Button>
      </form>
    </Form>
  );
}
