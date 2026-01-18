import s from "./Pagination.module.css"
import { getPaginationPages } from "@/common/utils"

type Props = {
  currentPage: number
  setCurrentPage: (page: number) => void
  pagesCount: number
}

export const Pagination = ({ currentPage, setCurrentPage, pagesCount }: Props) => {
  if (pagesCount <= 1) return null

  const pages = getPaginationPages(currentPage, pagesCount)

  return (
    <div className={s.pagination}>
      {pages.map((page, idx) =>
        page === "..." ? (
          <span className={s.ellipsis} key={`ellipsis-${idx}`}>
            ...
          </span>
        ) : (
          <button
            key={page}
            className={page === currentPage ? `${s.pageButton} ${s.pageButtonActive}` : s.pageButton}
            onClick={() => page !== currentPage && setCurrentPage(Number(page))}
            disabled={page === currentPage}
            type="button"
          >
            {page}
          </button>
        ),
      )}
    </div>
  )
}
