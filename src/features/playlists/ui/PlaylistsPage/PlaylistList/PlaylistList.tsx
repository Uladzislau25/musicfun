import s from "@/features/playlists/ui/PlaylistsPage/PlaylistsPage.module.css"
import { EditPlaylistForm } from "@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx"
import { PlaylistItem } from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { PlaylistData, UpdatePlaylistArgs } from "@/features/playlists/api/playlistsApi.types.ts"
import { useDeletePlaylistMutation } from "@/features/playlists/api/playlistApi.ts"

type Props = {
  playlists: PlaylistData[]
  isPlaylistLoading: boolean
}

export const PlaylistList = ({ playlists, isPlaylistLoading }: Props) => {
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const [deletePlaylist] = useDeletePlaylistMutation()

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm(`Are you sure you want to delete playlist?`)) {
      deletePlaylist(playlistId)
    }
  }
  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((tag) => tag.id),
      })
    } else {
      setPlaylistId(null)
    }
  }
  return (
    <div className={s.items}>
      {!playlists.length && !isPlaylistLoading && <h2>Playlist not found</h2>}
      {playlists.map((playlist) => {
        const isEditing = playlist.id === playlistId
        return (
          <div className={s.item} key={playlist.id}>
            {isEditing ? (
              <EditPlaylistForm
                playlistId={playlistId}
                setPlaylistId={setPlaylistId}
                editPlaylist={editPlaylistHandler}
                handleSubmit={handleSubmit}
                register={register}
              />
            ) : (
              <PlaylistItem
                playlist={playlist}
                editPlaylistHandler={editPlaylistHandler}
                deletePlaylistHandler={deletePlaylistHandler}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
