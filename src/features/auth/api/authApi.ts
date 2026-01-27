import { baseApi } from "@/app/api/baseApi.ts"
import type { LoginArgs, LoginResponse, MeResponse } from "@/features/auth/api/authApi.types.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
    }),
    login: build.mutation<LoginResponse, LoginArgs>({
      query: (payload) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: { ...payload, accessTokenTTL: "3m" },
        }
      },
    }),
  }),
})

export const { useGetMeQuery, useLoginMutation } = authApi
