import type { CurrentUserReaction, Images, Tag, User } from "@/common/types"
import type { createPlaylistSchema } from "@/features/playlists/model/playlists.schemas.ts"
import z from "zod"

export type PlaylistsResponse = {
  data: PlaylistData[]
  meta: PlaylistMeta
}

export type PlaylistData = {
  id: string
  type: "playlists"
  attributes: PlaylistAttributes
}

export type PlaylistMeta = {
  page: number
  pageSize: number
  totalCount: number
  pagesCount: number
}

export type PlaylistAttributes = {
  title: string
  description: string
  addedAt: string
  updatedAt: string
  order: number
  dislikesCount: number
  likesCount: number
  tags: Tag[]
  images: Images
  user: User
  currentUserReaction: CurrentUserReaction
}

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
export type CreatePlaylistArgs = z.infer<typeof createPlaylistSchema>
export type UpdatePlaylistArgs = {
  title: string
  description: string
  tagIds: string[]
}
