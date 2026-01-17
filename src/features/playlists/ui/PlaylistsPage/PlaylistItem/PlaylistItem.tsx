import type { PlaylistData } from "@/features/playlists/api/playlistsApi.types.ts"
import defaultCover from "@/assets/images/default-playlist-cover.png"
import s from "./PlaylistItem.module.css"
type Props = {
  playlist: PlaylistData
  deletePlaylistHandler: (playlistId: string) => void
  editPlaylistHandler: (playlist: PlaylistData) => void
}
export const PlaylistItem = ({ playlist, editPlaylistHandler, deletePlaylistHandler }: Props) => {
  return (
    <div>
      <img src={defaultCover} alt="cover" width={"100px"} className={s.cover} />
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylistHandler(playlist)}>update</button>
    </div>
  )
}
