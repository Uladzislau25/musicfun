import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { isErrorWithProperty } from "@/common/utils/isErrorWithProperty.ts"
import { isErrorWithDetailArray } from "@/common/utils/isErrorWithDetailArray.ts"
import { trimToMaxLength } from "@/common/utils/trimToMaxLength.ts"
import { errorToast } from "@/common/utils/errorToast.ts"

export const handleErrors = (error: FetchBaseQueryError) => {
  if (error) {
    switch (error.status) {
      case "FETCH_ERROR":
      case "PARSING_ERROR":
      case "CUSTOM_ERROR":
      case "TIMEOUT_ERROR":
        errorToast(error.error)
        break
      case 404:
        if (isErrorWithProperty(error.data, "error")) {
          errorToast(error.data.error)
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break
      case 401:
      case 429:
        if (isErrorWithProperty(error.data, "message")) {
          errorToast(error.data.message)
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break
      case 400:
      case 403:
        if (isErrorWithDetailArray(error.data)) {
          errorToast(trimToMaxLength(error.data.errors[0].detail))
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break

      default:
        if (error.status >= 500 && error.status < 600) {
          errorToast("Server error occured, Please try again later.", error)
        } else {
          errorToast("Some error occurred")
        }
    }
  }
}
