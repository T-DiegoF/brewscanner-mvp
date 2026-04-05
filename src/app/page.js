'use client'
import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import ProductCard from '@/components/ProductCard'
import { products, categories } from '@/data/products'
import { Search, SlidersHorizontal, X, TrendingUp, Package, Store } from 'lucide-react'

export default function HomePage() {
  const { emirate, fulfillment } = useApp()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popular')

  const filtered = useMemo(() => {
    let list = products

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q)
      )
    }

    // Filter by category
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory)
    }

    // Filter by fulfillment availability
    if (fulfillment) {
      list = list.filter(p => {
        if (fulfillment === 'delivery') return p.vendors.some(v => v.available_delivery)
        return p.vendors.some(v => v.available_collect)
      })
    }

    // Sort
    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => {
        const aMin = Math.min(...a.vendors.map(v => v.price))
        const bMin = Math.min(...b.vendors.map(v => v.price))
        return aMin - bMin
      })
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => {
        const aMin = Math.min(...a.vendors.map(v => v.price))
        const bMin = Math.min(...b.vendors.map(v => v.price))
        return bMin - aMin
      })
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating)
    } else {
      // popular: sort by reviews
      list = [...list].sort((a, b) => b.reviews - a.reviews)
    }

    return list
  }, [search, activeCategory, sortBy, fulfillment])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="py-10 md:py-14 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-brand-green px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <TrendingUp className="w-4 h-4" />
          Best prices in {emirate || 'UAE'}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Compare Alcohol Prices<br className="hidden sm:block" />
          <span className="text-brand-green"> Across UAE</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto mb-8">
          Find the best deals on spirits, wine and beer from multiple stores.
          {fulfillment === 'delivery' ? ' Home delivery available.' : ' Click & Collect from nearby stores.'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 text-center mb-8">
          {[
            { icon: Package, label: 'Products', value: '500+' },
            { icon: Store, label: 'Stores', value: '25+' },
            { icon: TrendingUp, label: 'Emirates', value: '7' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-brand-green">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search whisky, vodka, gin..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-green/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">
        Showing <span className="font-semibold text-gray-800">{filtered.length}</span> products
        {activeCategory !== 'All' && ` in ${activeCategory}`}
        {fulfillment === 'delivery' ? ' available for delivery' : ' available for collection'}
        {emirate ? ` in ${emirate}` : ''}
      </p>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3" />
          <p className="font-medium">No products found</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('All') }}
            className="mt-3 text-brand-green text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
