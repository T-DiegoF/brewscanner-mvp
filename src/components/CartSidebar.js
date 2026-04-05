'use client'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { X, Plus, Minus, ShoppingCart, Truck, ShoppingBag } from 'lucide-react'

export default function CartSidebar() {
  const {
    cartOpen, setCartOpen, cartByVendor, cartCount,
    cartSubtotal, deliveryTotal, fulfillment,
    removeFromCart, updateQuantity
  } = useApp()

  if (!cartOpen) return null

  const groups = Object.values(cartByVendor)

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-green" />
            <h2 className="font-bold text-lg">Your Cart</h2>
            {cartCount > 0 && (
              <span className="bg-brand-green text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {cartCount} items
              </span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Fulfillment badge */}
        {fulfillment && (
          <div className={`mx-5 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
            fulfillment === 'delivery' ? 'bg-green-50 text-brand-green' : 'bg-gray-50 text-gray-700'
          }`}>
            {fulfillment === 'delivery'
              ? <><Truck className="w-4 h-4" /> Home Delivery</>
              : <><ShoppingBag className="w-4 h-4" /> Click & Collect</>
            }
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <ShoppingCart className="w-12 h-12" />
              <p className="font-medium">Your cart is empty</p>
              <button
                onClick={() => setCartOpen(false)}
                className="text-brand-green text-sm font-medium hover:underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {groups.map(({ vendor, items }) => (
                <div key={vendor.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{vendor.logo}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{vendor.name}</p>
                      <p className="text-xs text-gray-500">{vendor.area}</p>
                    </div>
                    {fulfillment === 'delivery' && (
                      <span className="ml-auto text-xs text-gray-500">
                        +AED {vendor.delivery_fee} delivery
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 pl-2 border-l-2 border-gray-100">
                    {items.map(({ product, vendorProduct, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.volume}</p>
                          <p className="text-sm font-bold text-brand-green">
                            AED {(vendorProduct.price * quantity).toFixed(0)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(product.id, vendor.id, quantity - 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, vendor.id, quantity + 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id, vendor.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {groups.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">AED {cartSubtotal.toFixed(0)}</span>
            </div>
            {fulfillment === 'delivery' && deliveryTotal > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery fees</span>
                <span className="font-medium">AED {deliveryTotal}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-3">
              <span>Total</span>
              <span className="text-brand-green">AED {(cartSubtotal + deliveryTotal).toFixed(0)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full bg-brand-green text-white text-center py-3.5 rounded-xl font-semibold hover:bg-brand-green-dark transition-colors"
            >
              Proceed to Checkout
            </Link>
            <p className="text-xs text-center text-gray-400">
              🔒 21+ ID verification required at {fulfillment === 'delivery' ? 'delivery' : 'pickup'}
            </p>
          </div>
        )}
      </div>
    </>
  )
}
