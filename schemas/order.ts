import { z } from "zod";

// Base schema for all order types
const baseOrderSchema = z.object({
  type: z
    .string()
    .min(1, "Type is required")
    .refine(
      (val) => {
        return [
          "default",
          "package",
          "custom_comments",
          "mentions_with_hashtags",
          "mentions_hashtag",
          "subscriptions",
          "comment_likes",
          "poll",
          "comment_replies",
        ].includes(val);
      },
      {
        message: "Invalid order type",
      }
    ),
  serviceId: z.string().min(1, "Service ID is required"),
  price: z.number().min(0, "Price cannot be negative").optional(),
});

// Default order schema
const defaultOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Username is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  runs: z.number().int().optional(),
  interval: z.number().int(),
});

// Package order schema
const packageOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Username is required"),
});

// Custom comments order schema
const customCommentsOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Username is required"),
  comments: z.string().min(1, "Comments are required"),
});

// Mentions with hashtags order schema
const mentionsWithHashtagsOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Username is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  usernames: z.string().min(1, "Usernames are required"),
  hashtags: z.string().min(1, "Hashtags are required"),
});

// Mentions hashtag order schema
const mentionsHashtagOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Username is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  hashtag: z.string().min(1, "Hashtag is required"),
});

// Subscriptions order schema
const subscriptionsOrderSchema = baseOrderSchema.extend({
  username: z.string().min(1, "Username is required"),
  min: z.number().int().min(1, "Minimum quantity must be at least 1"),
  max: z.number().int().min(1, "Maximum quantity must be at least 1"),
  delay: z
    .number()
    .int()
    .min(0)
    .max(600, "Delay must be between 0 and 600 minutes"),
  posts: z.number().int().positive().optional(),
  old_posts: z.number().int().positive().optional(),
  expiry: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Expiry date must be in dd/mm/yyyy format")
    .optional(),
});

// Comment likes order schema
const commentLikesOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Username is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  username: z.string().min(1, "Username is required"),
});

// Poll order schema
const pollOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Username is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  answer_number: z.number().int().positive("Answer number must be positive"),
});

// Comment replies order schema
const commentRepliesOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Username is required"),
  username: z.string().min(1, "Username is required"),
  comments: z.string().min(1, "Comments are required"),
});

// Combined schema for all order types
export const createOrderSchema = z.discriminatedUnion("type", [
  defaultOrderSchema.extend({ type: z.literal("default") }),
  packageOrderSchema.extend({ type: z.literal("package") }),
  customCommentsOrderSchema.extend({ type: z.literal("custom_comments") }),
  mentionsWithHashtagsOrderSchema.extend({
    type: z.literal("mentions_with_hashtags"),
  }),
  mentionsHashtagOrderSchema.extend({ type: z.literal("mentions_hashtag") }),
  subscriptionsOrderSchema.extend({ type: z.literal("subscriptions") }),
  commentLikesOrderSchema.extend({ type: z.literal("comment_likes") }),
  pollOrderSchema.extend({ type: z.literal("poll") }),
  commentRepliesOrderSchema.extend({ type: z.literal("comment_replies") }),
]);

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
