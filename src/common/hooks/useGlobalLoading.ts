import type { RootState } from "@/app/model/store.ts"
import { useSelector } from "react-redux"
import { playlistApi } from "@/features/playlists/api/playlistApi.ts"

export const useGlobalLoading = () => {
  return useSelector((state: RootState) => {
    // Получаем все активные запросы из RTK Query API
    const queries = Object.values(state.baseApi.queries || {})
    const mutations = Object.values(state.baseApi.mutations || {})

    // Проверяем, есть ли активные запросы (статус 'pending')
    const hasActiveQueries = queries.some((query) => {
      if (query?.status !== "pending") return
      if (query.endpointName === playlistApi.endpoints.fetchPlaylists.name) {
        const completedQueries = queries.filter((q) => q?.status === "fulfilled")
        return completedQueries.length > 0
      }
    })
    const hasActiveMutations = mutations.some((mutation) => mutation?.status === "pending")

    return hasActiveQueries || hasActiveMutations
  })
}
