import { z } from "zod";

// Base schema per tutti i tipi di ordine
const baseOrderSchema = z.object({
  type: z
    .string()
    .min(1, "Il tipo è obbligatorio")
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
        message: "Tipo di ordine non valido",
      }
    ),
  serviceId: z.string().min(1, "L'ID del servizio è obbligatorio"),
  price: z.number().min(0, "Il prezzo non può essere negativo").optional(),
});

// Schema ordine default
const defaultOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Nome utente è obbligatorio"),
  quantity: z.number().int().min(1, "La quantità deve essere almeno 1"),
  runs: z.number().int().optional(),
  interval: z.number().int(),
});

// Schema ordine package
const packageOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Nome utente è obbligatorio"),
});

// Schema ordine custom comments
const customCommentsOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Nome utente è obbligatorio"),
  comments: z.string().min(1, "I commenti sono obbligatori"),
});

// Schema ordine mentions with hashtags
const mentionsWithHashtagsOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Nome utente è obbligatorio"),
  quantity: z.number().int().min(1, "La quantità deve essere almeno 1"),
  usernames: z.string().min(1, "I nomi utente sono obbligatori"),
  hashtags: z.string().min(1, "Gli hashtag sono obbligatori"),
});

// Schema ordine mentions hashtag
const mentionsHashtagOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Nome utente è obbligatorio"),
  quantity: z.number().int().min(1, "La quantità deve essere almeno 1"),
  hashtag: z.string().min(1, "L'hashtag è obbligatorio"),
});

// Schema ordine subscriptions
const subscriptionsOrderSchema = baseOrderSchema.extend({
  username: z.string().min(1, "Il nome utente è obbligatorio"),
  min: z.number().int().min(1, "La quantità minima deve essere almeno 1"),
  max: z.number().int().min(1, "La quantità massima deve essere almeno 1"),
  delay: z
    .number()
    .int()
    .min(0)
    .max(600, "Il ritardo deve essere compreso tra 0 e 600 minuti"),
  posts: z.number().int().positive().optional(),
  old_posts: z.number().int().positive().optional(),
  expiry: z
    .string()
    .regex(
      /^\d{2}\/\d{2}\/\d{4}$/,
      "La data di scadenza deve essere nel formato gg/mm/aaaa"
    )
    .optional(),
});

// Schema ordine comment likes
const commentLikesOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Nome utente è obbligatorio"),
  quantity: z.number().int().min(1, "La quantità deve essere almeno 1"),
  username: z.string().min(1, "Il nome utente è obbligatorio"),
});

// Schema ordine poll
const pollOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Nome utente è obbligatorio"),
  quantity: z.number().int().min(1, "La quantità deve essere almeno 1"),
  answer_number: z
    .number()
    .int()
    .positive("Il numero della risposta deve essere positivo"),
});

// Schema ordine comment replies
const commentRepliesOrderSchema = baseOrderSchema.extend({
  link: z.string().min(1, "Link/Nome utente è obbligatorio"),
  username: z.string().min(1, "Il nome utente è obbligatorio"),
  comments: z.string().min(1, "I commenti sono obbligatori"),
});

// Schema combinato per tutti i tipi di ordine
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
