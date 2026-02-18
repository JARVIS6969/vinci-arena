import './globals.css'

export const metadata = {
  title: 'Tournament Calculator',
  description: 'Manage your gaming tournaments',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
