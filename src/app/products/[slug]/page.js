'use client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { products } from '@/data/products'
import { vendors } from '@/data/vendors'
import { useApp } from '@/context/AppContext'
import {
  Star, MapPin, Truck, ShoppingBag, ChevronLeft,
  CheckCircle2, XCircle, Phone, Clock, Award
} from 'lucide-react'

export default function ProductPage({ params }) {
  const { slug } = use(params)
  const product = products.find(p => p.slug === slug)
  if (!product) notFound()

  const { fulfillment, addToCart } = useApp()

  const eligibleVendors = product.vendors
    .filter(vp => {
      if (fulfillment === 'delivery') return vp.available_delivery
      return vp.available_collect
    })
    .map(vp => ({
      ...vp,
      vendorData: vendors.find(v => v.id === vp.vendor_id),
    }))
    .filter(vp => vp.vendorData)
    .sort((a, b) => a.price - b.price)

  const minPrice = eligibleVendors.length > 0
    ? Math.min(...eligibleVendors.map(v => v.price))
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-green mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Product image + info */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 mb-6">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.tags.includes('bestseller') && (
              <div className="absolute top-4 left-4 bg-brand-green text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Bestseller
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-3">Product Details</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Category', value: product.category },
                { label: 'ABV', value: product.abv },
                { label: 'Volume', value: product.volume },
                { label: 'Origin', value: product.origin },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Right: Vendor comparison */}
        <div>
          <div className="mb-2">
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">{product.category}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <p className="text-gray-500 mt-1">{product.subtitle}</p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>

          {minPrice && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-5">
              <p className="text-sm text-gray-500">Best price available</p>
              <p className="text-3xl font-bold text-brand-green">AED {minPrice}</p>
            </div>
          )}

          {/* Vendor cards */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">
                Available from {eligibleVendors.length} store{eligibleVendors.length !== 1 ? 's' : ''}
              </h2>
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                fulfillment === 'delivery'
                  ? 'bg-brand-green/10 text-brand-green'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {fulfillment === 'delivery'
                  ? <><Truck className="w-3.5 h-3.5" /> Delivery</>
                  : <><ShoppingBag className="w-3.5 h-3.5" /> Collect</>
                }
              </div>
            </div>

            <div className="space-y-3">
              {eligibleVendors.map((vp, idx) => {
                const v = vp.vendorData
                const isBest = vp.price === minPrice
                return (
                  <div
                    key={v.id}
                    className={`bg-white rounded-2xl border-2 p-4 transition-all ${
                      isBest ? 'border-brand-green shadow-md' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Vendor info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0">
                          {v.logo}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-gray-900 text-sm">{v.name}</p>
                            {isBest && (
                              <span className="bg-brand-green text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                Best Price
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{v.area} · {v.distance_km} km away</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {v.supports_delivery
                                ? <CheckCircle2 className="w-3 h-3 text-brand-green" />
                                : <XCircle className="w-3 h-3 text-gray-300" />
                              }
                              <span className="text-xs text-gray-500">Delivery</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-brand-green" />
                              <span className="text-xs text-gray-500">Collect</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs text-gray-500">{v.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price + CTA */}
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-bold text-brand-green">AED {vp.price}</p>
                        {fulfillment === 'delivery' && (
                          <p className="text-xs text-gray-400">+AED {v.delivery_fee} delivery</p>
                        )}
                        <button
                          onClick={() => addToCart(product, v)}
                          className="mt-2 bg-brand-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-green-dark transition-colors w-full"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Store details */}
                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {v.hours}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {v.phone}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Age verification notice */}
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
            <span className="text-amber-500 text-lg">⚠️</span>
            <p className="text-xs text-amber-800">
              <strong>Age Verification Required:</strong> You must be 21+ and present a valid
              Emirates ID upon {fulfillment === 'delivery' ? 'delivery' : 'collection'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
