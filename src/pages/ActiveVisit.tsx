import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, FileText, ShoppingCart, DollarSign, Camera, X } from 'lucide-react';

export function ActiveVisit() {
  const { companyId, visitId } = useParams<{ companyId: string, visitId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  // Order state
  const [products, setProducts] = useState<any[]>([]);
  const [newOrder, setNewOrder] = useState({
    items: [] as any[],
    discount: 0,
    taxRate: 0.16
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  
  // Payment state
  const [invoices, setInvoices] = useState<any[]>([]);
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amount: '',
    paymentMethod: 'Cash'
  });
  
  // Complete state
  const [outcome, setOutcome] = useState('');
  
  useEffect(() => {
    fetchData();
  }, [visitId]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/tenants/${companyId}/visits/${visitId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      });
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await fetch(`/api/tenants/${companyId}/visits/${visitId}/checkin`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: 0, lng: 0 }) // GPS status unavailable
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Order logic
  useEffect(() => {
    if (showOrderModal) {
      fetch(`/api/tenants/${companyId}/products`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` } })
        .then(res => res.json()).then(res => setProducts(res.products || []));
    }
  }, [showOrderModal]);

  const handleAddItem = () => {
    if (!selectedProduct || selectedQty <= 0) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;
    
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: prod.id, name: prod.name, quantity: selectedQty, unitPrice: 10 }]
    });
    setSelectedProduct('');
    setSelectedQty(1);
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
          customerId: data.customer.id,
          repId: data.visit.repId,
          visitId: data.visit.id,
          items: newOrder.items,
          orderDiscount: newOrder.discount,
          taxRate: newOrder.taxRate
        })
      });
      if (res.ok) {
        setShowOrderModal(false);
        setNewOrder({ items: [], discount: 0, taxRate: 0.16 });
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create order');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Payment logic
  useEffect(() => {
    if (showPaymentModal) {
      fetch(`/api/tenants/${companyId}/invoices`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` } })
        .then(res => res.json()).then(res => {
          setInvoices((res.invoices || []).filter((i:any) => i.customerId === data.customer.id && i.status !== 'Paid' && i.status !== 'Cancelled'));
        });
    }
  }, [showPaymentModal]);

  const handleSubmitPayment = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tenants/${companyId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          invoiceId: paymentForm.invoiceId,
          amount: paymentForm.amount,
          paymentMethod: paymentForm.paymentMethod,
          repId: data.visit.repId,
          visitId: data.visit.id
        })
      });
      if (res.ok) {
        setShowPaymentModal(false);
        setPaymentForm({ invoiceId: '', amount: '', paymentMethod: 'Cash' });
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to record payment');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteVisit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tenants/${companyId}/visits/${visitId}/checkout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome })
      });
      if (res.ok) {
        navigate(`/company/${companyId}/customers/${data.customer.id}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8">Visit not found</div>;

  const { visit, customer, orders, payments } = data;
  const visitSales = orders.reduce((sum: number, o: any) => sum + Number(o.total), 0);
  const visitCollections = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="bg-white px-6 py-4 border-b flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{customer.name}</h1>
          <div className="text-sm text-slate-500">Visit Status: {visit.status}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Customer Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-slate-500">Outstanding Balance</div>
                <div className="text-xl font-bold text-slate-900">{customer.balance} JOD</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Credit Limit</div>
                <div className="text-xl font-bold text-slate-900">{customer.creditLimit} JOD</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Territory</div>
                <div className="text-xl font-bold text-slate-900">{customer.territory}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Visit Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {!visit.checkInLat && visit.status !== 'Completed' && (
                <button onClick={handleCheckIn} className="flex flex-col items-center justify-center p-4 bg-slate-50 border rounded-xl hover:bg-slate-100 transition-colors">
                  <MapPin className="w-8 h-8 text-slate-600 mb-2" />
                  <span className="font-medium">Check In</span>
                </button>
              )}
              {visit.status !== 'Completed' && (
                <>
                  <button onClick={() => setShowOrderModal(true)} className="flex flex-col items-center justify-center p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors text-blue-700">
                    <ShoppingCart className="w-8 h-8 mb-2" />
                    <span className="font-medium">Create Order</span>
                  </button>
                  <button onClick={() => setShowPaymentModal(true)} className="flex flex-col items-center justify-center p-4 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors text-emerald-700">
                    <DollarSign className="w-8 h-8 mb-2" />
                    <span className="font-medium">Record Payment</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-50 border rounded-xl hover:bg-slate-100 transition-colors">
                    <FileText className="w-8 h-8 text-slate-600 mb-2" />
                    <span className="font-medium">Complete Form</span>
                  </button>
                  <button onClick={() => setShowCompleteModal(true)} className="flex flex-col items-center justify-center p-4 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 transition-colors text-purple-700">
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <span className="font-medium">Complete Visit</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Visit Activity</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium">Orders Created</div>
                  <div className="text-sm text-slate-500">{orders.length} orders</div>
                </div>
                <div className="font-bold text-lg">{visitSales.toFixed(2)} JOD</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium">Payments Collected</div>
                  <div className="text-sm text-slate-500">{payments.length} payments</div>
                </div>
                <div className="font-bold text-lg">{visitCollections.toFixed(2)} JOD</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold">Create Order for Visit</h3>
              <button onClick={() => setShowOrderModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmitOrder} className="space-y-6">
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
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {newOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2">{item.name}</td>
                            <td className="py-2">{item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowOrderModal(false)} className="px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={newOrder.items.length === 0} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">Submit Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold">Record Payment</h3>
              <button onClick={() => setShowPaymentModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Invoice</label>
                <select required value={paymentForm.invoiceId} onChange={e => setPaymentForm({...paymentForm, invoiceId: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">-- Choose Invoice --</option>
                  {invoices.map(i => (
                    <option key={i.id} value={i.id}>{i.invoiceNumber} (Remaining: {i.remaining})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                <input required type="number" step="0.01" min="0.01" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                <select required value={paymentForm.paymentMethod} onChange={e => setPaymentForm({...paymentForm, paymentMethod: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Card</option>
                  <option>Cheque</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold">Complete Visit</h3>
              <button onClick={() => setShowCompleteModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCompleteVisit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Visit Outcome *</label>
                <select required value={outcome} onChange={e => setOutcome(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">-- Select Outcome --</option>
                  <option value="ORDER CREATED">Order Created</option>
                  <option value="PAYMENT COLLECTED">Payment Collected</option>
                  <option value="ORDER + PAYMENT">Order + Payment</option>
                  <option value="NO ORDER">No Order</option>
                  <option value="FOLLOW-UP REQUIRED">Follow-up Required</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCompleteModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg">Complete</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
