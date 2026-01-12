import { configureStore } from "@reduxjs/toolkit"
import { playlistApi } from "@/features/playlists/api/playlistApi.ts"
import { setupListeners } from "@reduxjs/toolkit/query"

export const store = configureStore({
  reducer: {
    [playlistApi.reducerPath]: playlistApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(playlistApi.middleware),
})
setupListeners(store.dispatch)
