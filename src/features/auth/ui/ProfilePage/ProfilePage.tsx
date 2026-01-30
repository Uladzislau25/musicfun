import { useGetMeQuery } from "@/features/auth/api/authApi.ts"
import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistApi.ts"
import { PlaylistList } from "@/features/playlists/ui/PlaylistsPage/PlaylistList/PlaylistList.tsx"
import { CreatePlaylistForm } from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm.tsx"
import s from "./ProfilePage.module.css"

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery()

  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery(
    { userId: meResponse?.userId },
    { skip: !meResponse?.userId },
  )
  if (isLoading || isMeLoading) return <h1>Seleton loader ...</h1>

  return (
    <div>
      <h1>{meResponse?.login} page</h1>
      <div className={s.container}>
        <CreatePlaylistForm />
        <PlaylistList isPlaylistLoading={isLoading || isMeLoading} playlists={playlistsResponse?.data || []} />
      </div>
    </div>
  )
}
