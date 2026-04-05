'use client'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { ShoppingCart, MapPin, ChevronDown, Truck, ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { emirate, fulfillment, cartCount, setCartOpen, setShowModal } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍺</span>
            <span className="font-bold text-xl text-brand-green">BrewScanner</span>
            <span className="hidden sm:block text-xs text-gray-400 font-normal">.ae</span>
          </Link>

          {/* Center: Location + Fulfillment (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <MapPin className="w-4 h-4 text-brand-green" />
              <span className="font-medium">{emirate || 'Select emirate'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {fulfillment && (
              <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  fulfillment === 'delivery'
                    ? 'bg-brand-green text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {fulfillment === 'delivery'
                  ? <><Truck className="w-4 h-4" /> Home Delivery</>
                  : <><ShoppingBag className="w-4 h-4" /> Click & Collect</>
                }
              </button>
            )}
          </div>

          {/* Right: Cart */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-brand-green-dark transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-2">
            <button
              onClick={() => { setShowModal(true); setMobileMenuOpen(false) }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600"
            >
              <MapPin className="w-4 h-4 text-brand-green" />
              <span>{emirate || 'Select emirate'}</span>
            </button>
            {fulfillment && (
              <button
                onClick={() => { setShowModal(true); setMobileMenuOpen(false) }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  fulfillment === 'delivery' ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {fulfillment === 'delivery'
                  ? <><Truck className="w-4 h-4" /> Home Delivery</>
                  : <><ShoppingBag className="w-4 h-4" /> Click & Collect</>
                }
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
