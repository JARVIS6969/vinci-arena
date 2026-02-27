import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'VINCI-ARENA PRO',
  description: 'The ultimate esports tournament management platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  )
}