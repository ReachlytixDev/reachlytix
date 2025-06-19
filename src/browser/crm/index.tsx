import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { CRMLayout } from "./components/CRMLayout"
import "./styles/globals.css"

export function initializeCRM(container: HTMLElement) {
  const root = ReactDOM.createRoot(container)
  root.render(<CRMLayout />)
  return root
}

export { CRMLayout }
export * from "./components"
export * from "./types"
export * from "./lib/utils"