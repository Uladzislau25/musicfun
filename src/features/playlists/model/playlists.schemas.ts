import z from "zod"

export const createPlaylistSchema = z.object({
  title: z
    .string()
    .min(1, "The title length must be more than 1 character")
    .max(100, "The title length must be less than 100 characters"),
  description: z.string().max(1000, "The description lenth must be less than 1000 characters"),
})
