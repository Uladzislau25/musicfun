//https://musicfun.it-incubator.app/api/1.0
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const playlistApi = createApi({
  reducerPath: "playlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
      "API-KEY": import.meta.env.VITE_API_KEY,
    },
  }),
  endpoints: (build) => ({
    fetchPlaylists: build.query<any, void>({
      query: () => "playlists",
    }),
  }),
})
