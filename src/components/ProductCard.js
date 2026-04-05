'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Truck, ShoppingBag } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { vendors } from '@/data/vendors'

export default function ProductCard({ product }) {
  const { fulfillment, addToCart } = useApp()

  // Filter vendor prices based on fulfillment
  const eligibleVendors = product.vendors.filter(vp => {
    if (fulfillment === 'delivery') return vp.available_delivery
    return vp.available_collect
  })

  if (eligibleVendors.length === 0) return null

  const minPrice = Math.min(...eligibleVendors.map(v => v.price))
  const maxPrice = Math.max(...eligibleVendors.map(v => v.price))
  const bestVendorProduct = eligibleVendors.find(v => v.price === minPrice)
  const bestVendor = vendors.find(v => v.id === bestVendorProduct.vendor_id)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    addToCart(product, bestVendor)
  }

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-brand-green/30 transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.tags.includes('bestseller') && (
            <span className="absolute top-2 left-2 bg-brand-green text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Bestseller
            </span>
          )}
          {product.tags.includes('premium') && !product.tags.includes('bestseller') && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Premium
            </span>
          )}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs px-2 py-0.5 rounded-full text-gray-600 font-medium">
            {eligibleVendors.length} store{eligibleVendors.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{product.category}</p>
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-0.5 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-1">{product.subtitle}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>

          {/* Price + vendor */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-400">From</p>
              <p className="text-xl font-bold text-brand-green">
                AED {minPrice}
                {minPrice !== maxPrice && <span className="text-sm font-normal text-gray-400"> – {maxPrice}</span>}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{bestVendor?.distance_km} km away</span>
              </div>
            </div>
            <button
              onClick={handleQuickAdd}
              className="bg-brand-green text-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-brand-green-dark transition-colors flex items-center gap-1"
            >
              {fulfillment === 'delivery'
                ? <Truck className="w-3.5 h-3.5" />
                : <ShoppingBag className="w-3.5 h-3.5" />
              }
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
