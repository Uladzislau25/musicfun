import { useDeletePlaylistMutation, useFetchPlaylistsQuery } from "@/features/playlists/api/playlistApi.ts"
import s from "./PlaylistsPage.module.css"
import { CreatePlaylistForm } from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm.tsx"

export const PlaylistsPage = () => {
  const { data } = useFetchPlaylistsQuery()
  const [deletePlaylist] = useDeletePlaylistMutation()

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm(`Are you sure you want to delete playlist?`)) {
      deletePlaylist(playlistId)
    }
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <div className={s.items}>
        {data?.data.map((playlist) => {
          return (
            <div className={s.item} key={playlist.id}>
              <div>title: {playlist.attributes.title}</div>
              <div>description: {playlist.attributes.description}</div>
              <div>userName: {playlist.attributes.user.name}</div>
              <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
