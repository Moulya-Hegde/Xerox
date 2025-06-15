import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import {AuthProvider} from './context/AuthContext'
export const metadata = {
  title: 'QuickPrint',
  description: 'Upload, pay, and pick up your prints — hassle-free.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className="flex flex-col min-h-screen">
        <AuthProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
