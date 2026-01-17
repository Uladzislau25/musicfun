import type { PlaylistData } from "@/features/playlists/api/playlistsApi.types.ts"
import defaultCover from "@/assets/images/default-playlist-cover.png"
import s from "./PlaylistItem.module.css"
import { useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation } from "@/features/playlists/api/playlistApi.ts"
import type { ChangeEvent } from "react"
type Props = {
  playlist: PlaylistData
  deletePlaylistHandler: (playlistId: string) => void
  editPlaylistHandler: (playlist: PlaylistData) => void
}
export const PlaylistItem = ({ playlist, editPlaylistHandler, deletePlaylistHandler }: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const maxSize = 1024 * 1024 // 1 MB
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"]

  const originalCover = playlist.attributes.images.main.find((img) => img.type === "original")
  const src = originalCover ? originalCover.url : defaultCover

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.length && event.target.files[0]
    if (!file) return
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG or GIF images are allowed")
      return
    }
    if (file.size > maxSize) {
      alert(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
      return
    }
    uploadPlaylistCover({
      playlistId: playlist.id,
      file: file,
    })
  }

  const deleteCoverHandler = () => {
    deletePlaylistCover({ playlistId: playlist.id })
  }

  return (
    <div>
      <img src={src} alt="cover" width={"100px"} className={s.cover} />
      <input type="file" accept={"image/jpeg,image/png,image/gif"} onChange={uploadCoverHandler} />
      {originalCover && <button onClick={deleteCoverHandler}>delete</button>}
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylistHandler(playlist)}>update</button>
    </div>
  )
}
