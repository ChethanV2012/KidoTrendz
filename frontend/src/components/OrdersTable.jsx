import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { useUserStore } from '../stores/useUserStore';

const OrdersTable = () => {
  const { user, token } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter/Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch all orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') fetchOrders();
  }, [user, token]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    orders.forEach(order => {
      order.items.forEach(item => cats.add(item.product.category));
    });
    return Array.from(cats).sort();
  }, [orders]);

  // Filtered & Sorted Data
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(order =>
        order.items.some(item => item.product.category === selectedCategory)
      );
    }

    if (dateFrom || dateTo) {
      const from = dateFrom ? new Date(dateFrom) : new Date(0);
      const to = dateTo ? new Date(dateTo) : new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= from && orderDate <= to;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'date') {
        aVal = new Date(a.date);
        bVal = new Date(b.date);
      } else if (sortBy === 'category') {
        aVal = a.items[0]?.product.category || '';
        bVal = b.items[0]?.product.category || '';
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [orders, searchTerm, selectedCategory, dateFrom, dateTo, sortBy, sortOrder]);

  // Toggle Sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (loading) return <div className="flex justify-center py-8">Loading orders...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (user?.role !== 'admin') return <div className="text-center py-8">Access denied. Admin only.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>

      {/* Controls: Search, Filter, Sort */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by user, product, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="p-2 border border-gray-600 rounded bg-gray-800 text-white w-full"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="p-2 border border-gray-600 rounded bg-gray-800 text-white w-full"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSort('date')}
            className="px-3 py-2 bg-green-600 rounded hover:bg-green-700 text-white"
          >
            Date {sortBy === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button
            onClick={() => handleSort('category')}
            className="px-3 py-2 bg-green-600 rounded hover:bg-green-700 text-white"
          >
            Category {sortBy === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 border border-gray-600 rounded">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-left">User Details</th>
              <th className="p-3 text-left">Order Date</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id} className="border-t border-gray-600 hover:bg-gray-700">
                <td className="p-3">
                  <div><strong>{order.user.name}</strong></div>
                  <div className="text-gray-400 text-sm">{order.user.email}</div>
                </td>
                <td className="p-3">{format(new Date(order.date), 'MMM dd, yyyy HH:mm')}</td>
                <td className="p-3">
                  {order.items.map(item => (
                    <div key={item.product._id} className="mb-2 p-2 bg-gray-700 rounded">
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-gray-400 text-sm">Category: {item.product.category}</div>
                      <div className="text-sm">Qty: {item.quantity} × ₹ {item.product.price}</div>
                      <div className="font-semibold">Subtotal: ₹ {(item.quantity * item.product.price).toFixed(2)}</div>
                    </div>
                  ))}
                </td>
                <td className="p-3 font-bold text-green-400">₹ {order.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-400">No orders match your filters.</div>
      )}
    </div>
  );
};

export default OrdersTable;