import z from "zod"
import {
  coverSchema,
  currentUserReactionSchema,
  imagesSchema,
  type tagSchema,
  userSchema,
} from "@/common/schemas/schemas.ts"

export type Tag = z.infer<typeof tagSchema>

export type User = z.infer<typeof userSchema>

export type Images = z.infer<typeof imagesSchema>

export type Cover = z.infer<typeof coverSchema>

export type CurrentUserReaction = z.infer<typeof currentUserReactionSchema>
