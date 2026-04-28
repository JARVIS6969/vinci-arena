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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
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