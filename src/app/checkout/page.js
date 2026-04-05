'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import Link from 'next/link'
import {
  ChevronLeft, MapPin, Truck, ShoppingBag, Clock,
  Phone, CheckCircle2, CreditCard, Shield, AlertCircle
} from 'lucide-react'

const timeSlots = ['9 AM – 12 PM', '12 PM – 3 PM', '3 PM – 6 PM', '6 PM – 9 PM']
const days = ['Today', 'Tomorrow', 'Wed 26', 'Thu 27', 'Fri 28']

export default function CheckoutPage() {
  const { cartByVendor, cartSubtotal, deliveryTotal, fulfillment, emirate, cartCount } = useApp()
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState(1)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [address, setAddress] = useState({ building: '', street: '', area: '', emirate: emirate })
  const [ordered, setOrdered] = useState(false)

  const groups = Object.values(cartByVendor)
  const grandTotal = cartSubtotal + deliveryTotal

  if (cartCount === 0 && !ordered) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <Link href="/" className="text-brand-green hover:underline font-medium">Back to shopping</Link>
      </div>
    )
  }

  if (ordered) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-brand-green" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 mb-6">
          {fulfillment === 'delivery'
            ? `Your order will be delivered ${days[selectedDay]} between ${timeSlots[selectedSlot]}.`
            : `Your order is ready for pickup. Please bring your Emirates ID.`
          }
        </p>
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
          {groups.map(({ vendor, items }) => (
            <div key={vendor.id} className="text-sm">
              <p className="font-semibold text-gray-800">{vendor.logo} {vendor.name}</p>
              <p className="text-gray-500 text-xs">
                {fulfillment === 'collect'
                  ? `Ready for pickup: ${days[selectedDay]}, 3 PM · ${vendor.address}`
                  : `Delivery: ${days[selectedDay]}, ${timeSlots[selectedSlot]}`
                }
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mb-6">
          A confirmation has been sent to your email and phone. 🔞 Remember to bring Emirates ID (21+).
        </p>
        <Link href="/" className="inline-block bg-brand-green text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-green-dark transition-colors">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-green mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to cart
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Checkout – {fulfillment === 'delivery' ? 'Home Delivery' : 'Click & Collect'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">

          {fulfillment === 'delivery' ? (
            <>
              {/* Delivery address */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-green" />
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    placeholder="Building / Apartment No."
                    value={address.building}
                    onChange={e => setAddress({ ...address, building: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green col-span-2"
                  />
                  <input
                    placeholder="Street / Road"
                    value={address.street}
                    onChange={e => setAddress({ ...address, street: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                  <input
                    placeholder="Area / Neighborhood"
                    value={address.area}
                    onChange={e => setAddress({ ...address, area: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                  <input
                    placeholder="Emirate"
                    value={address.emirate}
                    onChange={e => setAddress({ ...address, emirate: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green col-span-2 sm:col-span-1"
                  />
                </div>
              </div>

              {/* Delivery schedule */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-green" />
                  Delivery Schedule
                </h2>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {days.map((day, i) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(i)}
                      className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedDay === i
                          ? 'bg-brand-green text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot, i) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(i)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                        selectedSlot === i
                          ? 'bg-brand-green text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Click & Collect: pickup locations */
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-green" />
                Your Pickup Locations
              </h2>
              {groups.length > 1 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    You have {groups.length} pickup locations. Please collect from each store separately.
                  </p>
                </div>
              )}
              <div className="space-y-4">
                {groups.map(({ vendor, items }) => (
                  <div key={vendor.id} className="border border-gray-100 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">
                          {vendor.logo}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{vendor.name}</p>
                          <p className="text-xs text-gray-500">{vendor.address}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {vendor.hours}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-brand-green font-semibold bg-green-50 px-2 py-1 rounded-lg">
                        Ready Today 3 PM
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                      <Phone className="w-4 h-4" />
                      <span>{vendor.phone}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 space-y-0.5">
                      {items.map(({ product, quantity }) => (
                        <p key={product.id}>• {product.name} × {quantity}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Age verification */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="age-verify"
              checked={ageConfirmed}
              onChange={e => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-brand-green shrink-0"
            />
            <label htmlFor="age-verify" className="text-sm text-amber-900 cursor-pointer">
              <strong>Age Verification:</strong> I confirm I am 21 years or older and legally permitted
              to purchase alcohol in the UAE. I will present a valid Emirates ID upon{' '}
              {fulfillment === 'delivery' ? 'delivery' : 'collection'}.
            </label>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {groups.map(({ vendor, items }) => (
                <div key={vendor.id}>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{vendor.name}</p>
                  {items.map(({ product, vendorProduct, quantity }) => (
                    <div key={product.id} className="flex justify-between text-sm text-gray-700 py-0.5">
                      <span className="truncate mr-2">{product.name} ×{quantity}</span>
                      <span className="shrink-0 font-medium">AED {vendorProduct.price * quantity}</span>
                    </div>
                  ))}
                  {fulfillment === 'delivery' && (
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Delivery fee</span>
                      <span>AED {vendor.delivery_fee}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>AED {cartSubtotal}</span>
              </div>
              {fulfillment === 'delivery' && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span>AED {deliveryTotal}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-brand-green">AED {grandTotal}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="mt-4 space-y-2">
              <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-2 text-sm cursor-pointer hover:border-brand-green transition-colors">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Credit / Debit Card</span>
              </div>
              <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-2 text-sm cursor-pointer hover:border-brand-green transition-colors">
                <span className="font-bold text-gray-600">Apple Pay</span>
              </div>
            </div>

            <button
              onClick={() => ageConfirmed && setOrdered(true)}
              disabled={!ageConfirmed}
              className="mt-4 w-full bg-brand-green text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-green-dark transition-colors"
            >
              {fulfillment === 'delivery' ? 'Confirm & Pay' : 'Confirm Order & Pay'}
            </button>

            <div className="flex items-center justify-center gap-1 mt-3 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              Secure 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
