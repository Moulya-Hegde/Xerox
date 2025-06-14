import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata = {
  title: 'QuickPrint',
  description: 'Upload, pay, and pick up your prints — hassle-free.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
