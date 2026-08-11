import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Download, FileText, Plus, X, Trash2 } from 'lucide-react';

export function SalesOrders() {
  const { companyId } = useParams<{ companyId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    items: [] as any[],
    discount: 0,
    taxRate: 0.16
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  useEffect(() => {
    if (showAddModal) {
      fetch(`/api/tenants/${companyId}/customers`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` } })
        .then(res => res.json()).then(res => setCustomers(res.customers || []));
      fetch(`/api/tenants/${companyId}/products`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` } })
        .then(res => res.json()).then(res => setProducts(res.products || []));
    }
  }, [showAddModal, companyId]);

  const handleAddItem = () => {
    if (!selectedProduct || selectedQty <= 0) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;
    
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: prod.id, name: prod.name, quantity: selectedQty, unitPrice: Number(prod.price) || 0 }]
    });
    setSelectedProduct('');
    setSelectedQty(1);
  };

  const handleRemoveItem = (idx: number) => {
    const newItems = [...newOrder.items];
    newItems.splice(idx, 1);
    setNewOrder({ ...newOrder, items: newItems });
  };

  const handleSubmitOrder = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tenants/${companyId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          customerId: newOrder.customerId,
          repId: customers.find(c => c.id === newOrder.customerId)?.repId,
          items: newOrder.items,
          orderDiscount: newOrder.discount,
          taxRate: newOrder.taxRate
        })
      });
      if (res.ok) {
        const data = await res.json();
        setOrders([data.order, ...orders]);
        setShowAddModal(false);
        setNewOrder({ customerId: '', items: [], discount: 0, taxRate: 0.16 });
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create order');
      }
    } catch (e) {
      console.error(e);
      alert('Error creating order');
    }
  };

  useEffect(() => {
    fetch(`/api/tenants/${companyId}/orders`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setOrders(res.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [companyId]);

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales Orders</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Sales Orders</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> New Order
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
                placeholder="Search by order number or customer..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">Status:</span>
              <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-slate-50 outline-none">
                <option>All Statuses</option>
                <option>Draft</option>
                <option>Pending Approval</option>
                <option>Approved</option>
                <option>Delivered</option>
              </select>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Order Number</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium text-right">Subtotal</th>
                <th className="px-6 py-3 font-medium text-right">Tax</th>
                <th className="px-6 py-3 font-medium text-right">Total (JOD)</th>
                <th className="px-6 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-600 hover:underline">{order.orderNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">{order.subtotal}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">{order.tax}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{order.total}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 
                        order.status === 'Delivered' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Draft' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table></div></div>{showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold">Create New Order</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Customer *</label>
                  <select required value={newOrder.customerId} onChange={e => setNewOrder({...newOrder, customerId: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-slate-50">
                    <option value="">-- Choose Customer --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.customerCode || 'No Code'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Global Discount (Amount)</label>
                  <input type="number" step="0.01" value={newOrder.discount} onChange={e => setNewOrder({...newOrder, discount: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-medium text-slate-900 mb-3">Add Products</h4>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Product</label>
                    <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                      <option value="">Select...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-slate-500 mb-1">Qty</label>
                    <input type="number" min="1" value={selectedQty} onChange={e => setSelectedQty(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <button type="button" onClick={handleAddItem} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium">Add</button>
                </div>
                
                {newOrder.items.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500 border-b">
                          <th className="pb-2">Product</th>
                          <th className="pb-2">Qty</th>
                          <th className="pb-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {newOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2">{item.name}</td>
                            <td className="py-2">{item.quantity}</td>
                            <td className="py-2 text-right">
                              <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="pt-6 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={!newOrder.customerId || newOrder.items.length === 0} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">Submit Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
