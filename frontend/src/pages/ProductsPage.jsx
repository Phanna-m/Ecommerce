import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';

export default function ProductsPage({ selectedCategory = 'All', setSelectedCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchProducts().then(res => {
      if (mounted) {
        setProducts(res.data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const categories = ['All', 'Men', 'Women', 'Kids', 'New In'];

  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Men') {
      return p.name.includes('Men') || p.name.includes('Black Jacket') || p.name.includes('Orange');
    }
    if (selectedCategory === 'Women') {
      return p.name.includes('Women') || p.name.includes('White');
    }
    return p.category_name?.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Category Pills matching the user's uploaded Men pill */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse p-4 flex flex-col justify-between">
              <div className="bg-slate-200 h-44 rounded-xl mb-4" />
              <div className="space-y-2">
                <div className="bg-slate-200 h-4 w-3/4 rounded" />
                <div className="bg-slate-200 h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <p className="text-sm">No products found in "{selectedCategory}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
