import z from "zod"

export const createPlaylistSchema = z.object({
  title: z.string(),
  description: z.string(),
})
