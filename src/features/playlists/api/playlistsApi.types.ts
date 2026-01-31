import * as z from "zod"
import {
  playlistAttributesSchema,
  playlistDataSchema,
  playlistMetaSchema,
  type playlistsResponseSchema,
} from "@/features/playlists/model/playlists.schemas.ts"

export type PlaylistsResponse = z.infer<typeof playlistsResponseSchema>

export type PlaylistData = z.infer<typeof playlistDataSchema>

export type PlaylistMeta = z.infer<typeof playlistMetaSchema>

export type PlaylistAttributes = z.infer<typeof playlistAttributesSchema>
// Arguments
export type FetchPlaylistsArgs = {
  pageNumber?: number
  pageSize?: number
  search?: string
  sortBy?: "addedAt" | "likesCount"
  sortDirection?: "asc" | "desc"
  tagsIds?: string[]
  userId?: string
  trackId?: string
}
export type CreatePlaylistArgs = {
  title: string
  description: string
}
export type UpdatePlaylistArgs = {
  title: string
  description: string
  tagIds: string[]
}
