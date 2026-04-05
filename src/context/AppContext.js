'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { vendors } from '@/data/vendors'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [emirate, setEmirate] = useState('Dubai')
  const [fulfillment, setFulfillment] = useState(null) // 'delivery' | 'collect' | null
  const [showModal, setShowModal] = useState(true)
  const [cart, setCart] = useState([]) // [{product, vendor, quantity}]
  const [cartOpen, setCartOpen] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('brewscanner_prefs')
    if (saved) {
      const prefs = JSON.parse(saved)
      setEmirate(prefs.emirate || 'Dubai')
      setFulfillment(prefs.fulfillment || null)
      if (prefs.fulfillment) setShowModal(false)
    }
    const savedCart = localStorage.getItem('brewscanner_cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  const savePreferences = (em, ful) => {
    setEmirate(em)
    setFulfillment(ful)
    setShowModal(false)
    localStorage.setItem('brewscanner_prefs', JSON.stringify({ emirate: em, fulfillment: ful }))
  }

  const addToCart = (product, vendor) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.vendor.id === vendor.id)
      let updated
      if (existing) {
        updated = prev.map(i =>
          i.product.id === product.id && i.vendor.id === vendor.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      } else {
        const vendorData = vendors.find(v => v.id === vendor.id)
        const vendorProduct = product.vendors.find(vp => vp.vendor_id === vendor.id)
        updated = [...prev, { product, vendor: vendorData, vendorProduct, quantity: 1 }]
      }
      localStorage.setItem('brewscanner_cart', JSON.stringify(updated))
      return updated
    })
    setCartOpen(true)
  }

  const removeFromCart = (productId, vendorId) => {
    setCart(prev => {
      const updated = prev.filter(i => !(i.product.id === productId && i.vendor.id === vendorId))
      localStorage.setItem('brewscanner_cart', JSON.stringify(updated))
      return updated
    })
  }

  const updateQuantity = (productId, vendorId, qty) => {
    if (qty < 1) { removeFromCart(productId, vendorId); return }
    setCart(prev => {
      const updated = prev.map(i =>
        i.product.id === productId && i.vendor.id === vendorId ? { ...i, quantity: qty } : i
      )
      localStorage.setItem('brewscanner_cart', JSON.stringify(updated))
      return updated
    })
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const cartSubtotal = cart.reduce((sum, i) => sum + i.vendorProduct.price * i.quantity, 0)

  // Group cart by vendor
  const cartByVendor = cart.reduce((acc, item) => {
    const vid = item.vendor.id
    if (!acc[vid]) acc[vid] = { vendor: item.vendor, items: [] }
    acc[vid].items.push(item)
    return acc
  }, {})

  const deliveryTotal = fulfillment === 'delivery'
    ? Object.values(cartByVendor).reduce((sum, g) => sum + g.vendor.delivery_fee, 0)
    : 0

  return (
    <AppContext.Provider value={{
      emirate, fulfillment, showModal, setShowModal,
      savePreferences,
      cart, cartByVendor, cartCount, cartSubtotal, deliveryTotal,
      cartOpen, setCartOpen,
      addToCart, removeFromCart, updateQuantity,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
