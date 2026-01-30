import { useGetMeQuery } from "@/features/auth/api/authApi.ts"
import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistApi.ts"
import { PlaylistList } from "@/features/playlists/ui/PlaylistsPage/PlaylistList/PlaylistList.tsx"

export const ProfilePage = () => {
  const { data: meResponse } = useGetMeQuery()
  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery({
    userId: meResponse?.userId,
  })
  return (
    <div>
      <h1>{meResponse?.login} page</h1>
      <PlaylistList isPlaylistLoading={isLoading} playlists={playlistsResponse?.data || []} />
    </div>
  )
}
