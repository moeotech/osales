import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Plus, Download, Package } from 'lucide-react';
import { AddProductModal } from '../components/AddProductModal';

export function Products() {
  const { companyId } = useParams<{ companyId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/tenants/${companyId}/products`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setProducts(res.products || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [companyId]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products & Pricing</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Products</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="relative w-96">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search products by name or SKU..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">Price List:</span>
              <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-slate-50 outline-none">
                <option>Default (Retail)</option>
                <option>Wholesale</option>
                <option>VIP</option>
              </select>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Barcode</th>
                <th className="px-6 py-3 font-medium text-right">Cost (JOD)</th>
                <th className="px-6 py-3 font-medium text-right">Price (JOD)</th>
                <th className="px-6 py-3 font-medium text-center">Stock</th>
                <th className="px-6 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No products found.</td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 cursor-pointer hover:text-blue-600">{product.name}</div>
                          {product.arabicName && <div className="text-xs text-slate-500">{product.arabicName}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{product.barcode}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">{product.cost || '-'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{product.price}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">{product.stock}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {companyId && (
        <AddProductModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          companyId={companyId} 
          onAdd={(p) => setProducts([p, ...products])} 
        />
      )}
    </div>
  );
}
