import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistApi.ts"
import s from "./PlaylistsPage.module.css"
import { CreatePlaylistForm } from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm.tsx"

import { type ChangeEvent, useEffect, useState } from "react"
import { useDebounceValue } from "@/common/hooks"
import { Pagination } from "@/common/components"
import { PlaylistList } from "@/features/playlists/ui/PlaylistsPage/PlaylistList/PlaylistList.tsx"
import { toast } from "react-toastify"

export const PlaylistsPage = () => {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  const debounceSearch = useDebounceValue(search)
  const { data, isLoading, error } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize: pageSize,
  })
  useEffect(() => {
    if (error) {
      if ("status" in error) {
        // FetchBaseQueryError
        const errMsg =
          "error" in error
            ? error.error
            : (error.data as { error: string }).error ||
              (error.data as { message: string }).message ||
              "Some error occurred"
        toast(errMsg, { type: "error", theme: "colored" })
      } else {
        //SerializedError
        const errMsg = error.message || "Some error occurred"
        toast(errMsg, { type: "error", theme: "colored" })
      }
    }
  }, [error])

  const changePageSizeHandler = (size: number) => {
    setCurrentPage(1)
    setPageSize(size)
  }
  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }
  if (isLoading) return <h1>Skeleton loader...</h1>

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input type="search" placeholder="Search playlist by title" onChange={(e) => searchPlaylistHandler(e)} />
      <PlaylistList isPlaylistLoading={isLoading} playlists={data?.data || []} />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
      />
    </div>
  )
}
