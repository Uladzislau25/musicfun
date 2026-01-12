import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router"
import { App } from "@/app/ui/app/App.tsx"
import { Provider } from "react-redux"
import { store } from "@/app/model/store.ts"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
)
