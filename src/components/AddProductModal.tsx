import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onAdd: (product: any) => void;
}

export function AddProductModal({ isOpen, onClose, companyId, onAdd }: AddProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    localName: '',
    categoryId: '',
    subCategoryId: '',
    sku: '',
    unit: 'PCS',
    taxType: '',
    tax: 0,
    rsl: 0,
    barcode: '',
    description: '',
    localDescription: '',
    media: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/tenants/${companyId}/categories`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      })
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(console.error);
    }
  }, [isOpen, companyId]);

  if (!isOpen) return null;

  const mainCategories = categories.filter(c => !c.parentId);
  const subCategories = categories.filter(c => c.parentId === formData.categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/tenants/${companyId}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ ...formData, price: 0 }) // we pass default price 0 since it requires price
      });
      if (res.ok) {
        const data = await res.json();
        onAdd(data.product);
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Add New Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name*</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Local Name*</label>
              <input type="text" required value={formData.localName} onChange={e => setFormData({...formData, localName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category*</label>
              <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value, subCategoryId: ''})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Select category...</option>
                {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub-Category*</label>
              <select required value={formData.subCategoryId} onChange={e => setFormData({...formData, subCategoryId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" disabled={!formData.categoryId}>
                <option value="">Select sub-category...</option>
                {subCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
              <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Measure Unit*</label>
              <select required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="PCS">PCS</option>
                <option value="BOX">BOX</option>
                <option value="CTN">CTN</option>
                <option value="KG">KG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tax Type</label>
              <select value={formData.taxType} onChange={e => setFormData({...formData, taxType: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Select tax...</option>
                <option value="VAT">VAT</option>
                <option value="GST">GST</option>
                <option value="None">None</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tax %</label>
              <input type="number" step="0.01" value={formData.tax} onChange={e => setFormData({...formData, tax: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">RSL (Recommended Stock Level)</label>
              <input type="number" value={formData.rsl} onChange={e => setFormData({...formData, rsl: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Barcode*</label>
              <input type="text" required value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description*</label>
            <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Local Description*</label>
            <textarea required rows={2} value={formData.localDescription} onChange={e => setFormData({...formData, localDescription: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Assigned media</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 mb-2 text-slate-400" />
              <span className="text-sm">Click to upload media files</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-700 hover:bg-slate-100 font-medium rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
