'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { emirates } from '@/data/products'
import { MapPin, ShoppingBag, Truck, X } from 'lucide-react'

export default function WelcomeModal() {
  const { showModal, savePreferences } = useApp()
  const [selectedEmirate, setSelectedEmirate] = useState('Dubai')
  const [selectedFulfillment, setSelectedFulfillment] = useState(null)

  if (!showModal) return null

  const handleStart = () => {
    if (!selectedFulfillment) return
    savePreferences(selectedEmirate, selectedFulfillment)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-brand-green p-6 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl font-bold">🍺 BrewScanner</span>
          </div>
          <p className="text-green-100 text-sm">UAE's best alcohol price comparison</p>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Welcome!</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Let's personalize your shopping experience</p>

          {/* Emirate selection */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1 text-brand-green" />
              Select your Emirate
            </label>
            <select
              value={selectedEmirate}
              onChange={e => setSelectedEmirate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-green bg-gray-50"
            >
              {emirates.map(em => (
                <option key={em} value={em}>{em}</option>
              ))}
            </select>
          </div>

          {/* Fulfillment selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              How would you like to receive your order?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedFulfillment('collect')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedFulfillment === 'collect'
                    ? 'border-brand-green bg-green-50 text-brand-green'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <ShoppingBag className="w-8 h-8" />
                <span className="font-semibold text-sm">Click & Collect</span>
                <span className="text-xs text-gray-500">Pick up from nearby stores</span>
              </button>
              <button
                onClick={() => setSelectedFulfillment('delivery')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedFulfillment === 'delivery'
                    ? 'border-brand-green bg-green-50 text-brand-green'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Truck className="w-8 h-8" />
                <span className="font-semibold text-sm">Home Delivery</span>
                <span className="text-xs text-gray-500">Delivered to your doorstep</span>
                <span className="text-xs font-medium text-amber-600">21+ ID required</span>
              </button>
            </div>
          </div>

          {/* Legal notice */}
          <p className="text-xs text-gray-400 text-center mb-4">
            By continuing you confirm you are 21+ and legally permitted to purchase alcohol in the UAE.
          </p>

          <button
            onClick={handleStart}
            disabled={!selectedFulfillment}
            className="w-full bg-brand-green text-white py-3.5 rounded-xl font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-green-dark transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
