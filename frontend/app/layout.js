
import './globals.css'
import Navbar from './components/Navbar'
import { Suspense } from 'react'
import TopLoader from './components/TopLoader'

export const metadata = {
  title: 'VINCI-ARENA PRO',
  description: 'The ultimate esports tournament management platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        <Navbar />
        {children}
      </body>
    </html>
  )
}