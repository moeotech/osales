import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, RefreshCw, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { AddCategoryModal } from '../components/AddCategoryModal';

export function ProductCategories() {
  const { companyId } = useParams<{ companyId: string }>();
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [companyId]);

  const fetchCategories = () => {
    setLoading(true);
    fetch(`/api/tenants/${companyId}/categories`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(res => res.json())
      .then(res => {
        setCategories(res.categories || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredCategories = categories.filter(c => 
    (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Product Categories</h2>
          <p className="text-sm text-slate-500">Manage categories for your products.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchCategories} className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm">
             <RefreshCw className="h-4 w-4" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="pl-9 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium text-sm">
            Add Category
          </button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Parent Category</th>
                <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-lg">
                        <Copy className="w-5 h-5 text-slate-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                    <td className="px-6 py-4 text-slate-500">{category.code || '-'}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {category.parentId ? categories.find(c => c.id === category.parentId)?.name || 'Unknown' : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {category.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && filteredCategories.length === 0 && (
                   <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">No categories found.</td></tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
      
      {companyId && (
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          companyId={companyId}
          onAdd={(c) => setCategories([c, ...categories])}
          parentCategories={categories.filter(c => !c.parentId)}
        />
      )}
    </div>
  );
}
