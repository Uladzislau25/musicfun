import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types.ts"
import { baseApi } from "@/app/api/baseApi.ts"
import type { Images } from "@/common/types"

export const playlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => {
        return {
          url: "playlists",
          params,
        }
      },
      providesTags: ["Playlist"],
    }),
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        url: "playlists",
        method: "post",
        body,
      }),
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
        body,
      }),
      onQueryStarted: async ({ playlistId, body }, { queryFulfilled, dispatch, getState }) => {
        const args = playlistApi.util.selectCachedArgsForQuery(getState(), "fetchPlaylists")
        const patchCollections: any[] = []
        args.forEach((arg) => {
          patchCollections.push(
            dispatch(
              playlistApi.util.updateQueryData(
                "fetchPlaylists",
                {
                  pageNumber: arg.pageNumber,
                  pageSize: arg.pageSize,
                  search: arg.search,
                },
                (state) => {
                  const index = state.data.findIndex((playlist) => playlist.id === playlistId)
                  if (index !== -1) {
                    state.data[index].attributes = { ...state.data[index].attributes, ...body }
                  }
                },
              ),
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
      invalidatesTags: ["Playlist"],
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
