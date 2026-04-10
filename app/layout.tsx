// Root layout — minimal wrapper required by Next.js App Router.
// Locale-specific layout (app/[locale]/layout.tsx) handles html/body, font, Header, Footer.
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
