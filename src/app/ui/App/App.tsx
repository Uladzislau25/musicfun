import s from "./App.module.css"
import { Routing } from "@/common/routing"
import { Header } from "@/common/components"

export const App = () => {
  return (
    <>
      <Header />
      <div className={s.layout}>
        <Routing />
      </div>
    </>
  )
}
