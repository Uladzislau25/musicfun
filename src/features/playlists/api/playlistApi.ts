//https://musicfun.it-incubator.app/api/1.0
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const playlistApi = createApi({
  reducerPath: "playlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://musicfun.it-incubator.app/api/1.0",
    headers: {
      "API-KEY": "XXX",
    },
  }),
  endpoints: (build) => ({
    fetchPlaylists: build.query<any, void>({
      query: () => "",
    }),
  }),
})
