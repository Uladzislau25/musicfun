import { Mutex } from "async-mutex"
import { baseQuery } from "@/app/api/baseQuery.ts"
import { handleErrors, isTokens } from "@/common/utils"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { AUTH_KEYS } from "@/common/constants"
import { baseApi } from "@/app/api/baseApi.ts"

const mutex = new Mutex()
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOption,
) => {
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOption)
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        const refreshResult = await baseQuery(
          { url: "/auth/refresh", method: "post", body: { refreshToken } },
          api,
          extraOption,
        )
        if (refreshResult.data && isTokens(refreshResult.data)) {
          localStorage.setItem(AUTH_KEYS.accessToken, refreshResult.data.accessToken)
          localStorage.setItem(AUTH_KEYS.refreshToken, refreshResult.data.refreshToken)

          result = await baseQuery(args, api, extraOption)
        } else {
          //@ts-expect-error RTK Query typing issue
          api.dispatch(baseApi.endpoints.logout.initiate())
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOption)
    }
  }
  if (result.error && result.error.status !== 401) {
    handleErrors(result.error)
  }
  return result
}
