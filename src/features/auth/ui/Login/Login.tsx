import { useLoginMutation } from "@/features/auth/api/authApi.ts"

export const Login = () => {
  const [login] = useLoginMutation()
  const loginHandler = () => {
    const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + "/oauth/callback"
    const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackURL=${redirectUri}`

    window.open(url, "oauthPopop", "width=500, height=600")
    const receiveMessage = (event: MessageEvent) => {
      window.removeEventListener("message", receiveMessage)
      login({
        code: "",
        redirectUri,
        rememberMe: false,
      })
    }
    window.addEventListener("message", receiveMessage)
  }
  return (
    <button type={"button"} onClick={loginHandler}>
      Login
    </button>
  )
}
