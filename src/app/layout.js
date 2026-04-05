import './globals.css'
import { Inter } from 'next/font/google'
import { AppProvider } from '@/context/AppContext'
import Navbar from '@/components/Navbar'
import WelcomeModal from '@/components/WelcomeModal'
import CartSidebar from '@/components/CartSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BrewScanner.ae – Best Alcohol Prices in UAE',
  description: 'Compare alcohol prices across multiple stores in Dubai and the UAE. Click & Collect or Home Delivery.',
  keywords: 'alcohol prices UAE, buy alcohol Dubai, spirits delivery UAE',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <AppProvider>
          <WelcomeModal />
          <CartSidebar />
          <Navbar />
          <main>{children}</main>
          <footer className="bg-gray-900 text-gray-400 text-center py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4">
              <p className="text-brand-green font-bold text-lg mb-1">🍺 BrewScanner.ae</p>
              <p className="text-sm">UAE's best alcohol price comparison platform</p>
              <p className="text-xs mt-3">🔞 Must be 21+ to purchase alcohol. Please drink responsibly.</p>
              <p className="text-xs mt-1">© 2026 BrewScanner.ae – All rights reserved</p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  )
}
