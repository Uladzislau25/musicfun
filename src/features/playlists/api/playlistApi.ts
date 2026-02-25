import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistData,
  PlaylistUpdatedEvent,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types.ts"
import { baseApi } from "@/app/api/baseApi.ts"
import type { Images } from "@/common/types"
import { playlistCreateResponseSchema, playlistResponseSchema } from "@/features/playlists/model/playlists.schemas.ts"
import { imagesSchema } from "@/common/schemas/schemas.ts"
import { withZodCath } from "@/common/utils/withZodCath.ts"
import { subscribeToEvent } from "@/common/socket/subscribeToEvent.ts"
import { SOCKET_EVENTS } from "@/common/constants"

export const playlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: "playlists", params }),
      ...withZodCath(playlistResponseSchema),
      keepUnusedDataFor: 0, // очистка сразу после размонтирования
      async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // Ждем разрешения начального запроса перед продолжением
        await cacheDataLoaded

        const unsubscribes = [
          subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg) => {
          const newPlaylist = msg.payload.data
          updateCachedData((state) => {
            state.data.pop()
            state.data.unshift(newPlaylist)
            state.meta.totalCount = state.meta.totalCount + 1
            state.meta.pagesCount = Math.ceil(state.meta.pagesCount / state.meta.pageSize)
          })
        }),
        subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, (msg) => {
          const newPlaylist = msg.payload.data
          updateCachedData((state) => {
            const index = state.data.findIndex((playlist) => playlist.id === newPlaylist.id)
            if (index !== -1) {
              state.data[index] = { ...state.data[index], ...newPlaylist }
            }
          })
        })
      ]
        // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
        await cacheEntryRemoved
        unsubscribes.forEach((unsubscribe) => unsubscribe())
      },
      providesTags: ["Playlist"],
    }),
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        url: "playlists",
        method: "post",
        body: {
          data: {
            type: "playlists",
            attributes: body,
          },
        },
      }),
      ...withZodCath(playlistCreateResponseSchema),
      invalidatesTags: ["Playlist"],
    }),
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({
        url: `playlists/${playlistId}`,
        method: "delete",
      }),
      invalidatesTags: ["Playlist"],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({
        url: `playlists/${playlistId}`,
        method: "put",
        body: {
          data: {
            type: "playlists",
            attributes: {
              title: body.title,
              description: body.description,
              tagIds: body.tagIds,
            },
          },
        },
      }),
      onQueryStarted: async ({ playlistId, body }, { queryFulfilled, dispatch, getState }) => {
        const args = playlistApi.util.selectCachedArgsForQuery(getState(), "fetchPlaylists")
        const patchCollections: any[] = []
        args.forEach((arg) => {
          patchCollections.push(
            dispatch(
              playlistApi.util.updateQueryData("fetchPlaylists", arg, (state) => {
                const index = state.data.findIndex((playlist) => playlist.id === playlistId)
                if (index !== -1) {
                  state.data[index].attributes = {
                    ...state.data[index].attributes,
                    title: body.title,
                    updatedAt: new Date().toISOString(),
                  }
                }
              }),
            ),
          )
        })

        try {
          await queryFulfilled
        } catch {
          patchCollections.forEach((patchCollection) => {
            patchCollection.undo()
          })
        }
      },
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append("file", file)
        return {
          url: `playlists/${playlistId}/images/main`,
          method: "post",
          body: formData,
        }
      },
      ...withZodCath(imagesSchema),
      invalidatesTags: ["Playlist"],
    }),
    deletePlaylistCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({
        url: `playlists/${playlistId}/images/main`,
        method: "delete",
      }),
      invalidatesTags: ["Playlist"],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistApi
