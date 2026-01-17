import { useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation } from "@/features/playlists/api/playlistApi.ts"
import defaultCover from "@/assets/images/default-playlist-cover.png"
import type { ChangeEvent } from "react"
import type { Images } from "@/common/types"
import s from "./PlaylistCover.module.css"
import { toast } from "react-toastify"

type Props = {
  playlistId: string
  images: Images
}

export const PlaylistCover = ({ playlistId, images }: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const maxSize = 1024 * 1024 // 1 MB
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"]

  const originalCover = images.main.find((img) => img.type === "original")
  const src = originalCover ? originalCover.url : defaultCover

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.length && event.target.files[0]
    if (!file) return
    if (!allowedTypes.includes(file.type)) {
      toast("Only JPEG, PNG or GIF images are allowed", { type: "error", theme: "colored" })
      return
    }
    if (file.size > maxSize) {
      toast(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`, { type: "error", theme: "colored" })
      return
    }
    uploadPlaylistCover({
      playlistId,
      file: file,
    })
  }

  const deleteCoverHandler = () => {
    deletePlaylistCover({ playlistId })
  }

  return (
    <>
      <img src={src} alt="cover" width={"100px"} className={s.cover} />
      <input type="file" accept={"image/jpeg,image/png,image/gif"} onChange={uploadCoverHandler} />
      {originalCover && <button onClick={deleteCoverHandler}>delete</button>}
    </>
  )
}
