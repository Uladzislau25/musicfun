import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistData,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types.ts"
import { baseApi } from "@/app/api/baseApi.ts"
import type { Images } from "@/common/types"
import { playlistCreateResponseSchema, playlistResponseSchema } from "@/features/playlists/model/playlists.schemas.ts"
import { imagesSchema } from "@/common/schemas/schemas.ts"
import { withZodCath } from "@/common/utils/withZodCath.ts"
import { io, Socket } from "socket.io-client"

export const playlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: "playlists", params }),
      ...withZodCath(playlistResponseSchema),
      keepUnusedDataFor: 0, // очистка сразу после размонтирования
      async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // Ждем разрешения начального запроса перед продолжением
        await cacheDataLoaded

        // Создаем Socket.IO соединение с сервером

        const socket: Socket = io("https://musicfun.it-incubator.app", {
          path: "/api/1.0/ws", // пользовательский путь для Socket.IO сервера (по умолчанию '/socket.io/')
          transports: ["websocket"],
        })
        socket.on("connect", () => console.log("Подключен к серверу"))
        socket.on("tracks.playlist-created", (msg: PlaylistCreatedEvent) => {
          const newPlaylist = msg.payload.data
          updateCachedData((state) => {
            state.data.pop()
            state.data.unshift(newPlaylist)
            state.meta.totalCount = state.meta.totalCount + 1
            state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
          })
          // 2 вариант
          // dispatch(playlistApi.util.invalidateTags(['Playlist'}))
        })

        // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
        await cacheEntryRemoved
        // Выполняем шаги очистки после разрешения промиса 'cacheEntryRemoved'
        socket.on("disconnect", () => console.log("Соединение разорвано"))
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
