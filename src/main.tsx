import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router/dom"
import { Toaster } from "sonner"
import "./index.css"
import { router } from "./routes.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </ThemeProvider>
    </TooltipProvider>
  </StrictMode>
)
