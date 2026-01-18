import { useFetchTracksInfiniteQuery } from "@/features/tracks/api/tracksApi.ts"
import s from "./TracksPage.module.css"

export const TracksPage = () => {
  const { data, hasNextPage, isLoading, isFetching, isFetchingNextPage, fetchNextPage } = useFetchTracksInfiniteQuery()
  console.log(data)
  const pages = data?.pages.flatMap((page) => page.data) || []

  const loadMoreHandler = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }

  return (
    <div>
      <h1>Tracks page</h1>
      <div className={s.list}>
        {pages.map((track) => {
          const { title, user, attachments } = track.attributes
          return (
            <div key={track.id} className={s.item}>
              <div>
                <p>Title: {title}</p>
                <p>Name: {user.name}</p>
              </div>
              {attachments.length ? <audio controls src={attachments[0].url} /> : "no file"}
            </div>
          )
        })}
      </div>
      {!isLoading && (
        <>
          {hasNextPage ? (
            <button onClick={loadMoreHandler} disabled={isFetching}>
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          ) : (
            <p>Nothing more to load</p>
          )}
        </>
      )}
    </div>
  )
}
