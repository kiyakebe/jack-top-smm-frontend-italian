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
import { useEffect } from "react";

// const orderTypeOptions = [
//   { value: "default", label: "Default Order" },
//   { value: "package", label: "Package Order" },
//   { value: "custom_comments", label: "Custom Comments" },
//   { value: "mentions_with_hashtags", label: "Mentions with Hashtags" },
//   { value: "mentions_hashtag", label: "Mentions Hashtag" },
//   { value: "subscriptions", label: "Subscriptions" },
//   { value: "comment_likes", label: "Comment Likes" },
//   { value: "poll", label: "Poll" },
//   { value: "comment_replies", label: "Comment Replies" },
// ];

interface AddNewOrderFormProps {
  serviceId: string;
  min: number;
  max: number;
  onSuccess?: () => void;
  isFree: boolean;
}

export default function AddNewOrderForm({
  serviceId,
  min,
  max,
  onSuccess,
  isFree,
}: AddNewOrderFormProps) {
  const createOrder = useCreateOrder();
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      type: "default",
      serviceId,
      ...(isFree && { runs: 0, interval: 0 }),
    },
  });

  // If serviceId changes, update the form value
  useEffect(() => {
    if (serviceId) {
      form.setValue("serviceId", serviceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  // Clear root error when the form is unmounted (modal closed)
  useEffect(() => {
    return () => {
      form.clearErrors("root");
    };
  }, [form]);

  const selectedType = form.watch("type");

  async function onSubmit(values: CreateOrderFormValues) {
    // console.log(JSON.stringify(values, null, 2));

    try {
      // Validate link/username based on service type for order types that have link field
      if ("link" in values && values.link) {
        if (isFree) {
          // For free services, validate username format
          const usernameRegex = /^@?[a-zA-Z0-9._]+$/;
          if (!usernameRegex.test(values.link)) {
            form.setError("link", {
              type: "manual",
              message:
                "Invalid username format. Use only letters, numbers, underscores, and dots.",
            });
            return;
          }
          if (values.link.length < 3) {
            form.setError("link", {
              type: "manual",
              message: "Username must be at least 3 characters long.",
            });
            return;
          }
          if (values.link.length > 30) {
            form.setError("link", {
              type: "manual",
              message: "Username must be less than 30 characters long.",
            });
            return;
          }
        } else {
          // For paid services, validate URL format
          try {
            new URL(values.link);
          } catch {
            form.setError("link", {
              type: "manual",
              message: "Invalid URL format. Please enter a valid URL.",
            });
            return;
          }
        }
      }

      if (isFree) {
        if (values.type === "default") {
          values.runs = 0;
          values.interval = 0;
        }
      }

      await createOrder.mutateAsync(values);
      if (onSuccess) onSuccess();
      form.reset({
        type: "default",
        serviceId,
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
        {/* Conditional Fields Based on Order Type */}
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
                {isFree ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter username (e.g., username, @username, user.name)
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a valid URL (e.g., https://example.com/post/123)
                  </p>
                )}
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
                  Quantity (Min: {min} and Max: {max})
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`Min: ${min} and Max ${max}`}
                    min={min}
                    max={max}
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
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? "Creating Order" : "Create Order"}
        </Button>
      </form>
    </Form>
  );
}
