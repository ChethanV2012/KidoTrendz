import Order from '../models/order.model.js';  // Adjust path to your Order model

// Controller function to fetch all orders
export const getAllOrders = async (req, res) => {
  try {
    // Extract query params for filtering/sorting
    const { search, category, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build MongoDB query object
    let query = {};
    if (search) {
      // Search across user name, order ID, product names (case-insensitive)
      query.$or = [
        { 'user.name': { $regex: search, $options: 'i' } },  // Assumes User model has 'name'
        { _id: { $regex: search, $options: 'i' } },
        { 'products.product.name': { $regex: search, $options: 'i' } },  // Assumes Product has 'name'
      ];
    }
    if (category && category !== 'All') {
      query['products.product.category'] = category;  // Assumes Product has 'category'
    }
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z');  // End of day
    }

    // Execute query: Find, populate, sort
    const orders = await Order.find(query)
      .populate('user', 'name email')  // Populate user details
      .populate('products.product', 'name image category price')  // Populate product details (use 'image' from model)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .lean();  // Optimize for read-only

    // Transform data to match frontend (e.g., 'products' → 'items', 'totalAmount' → 'total')
    const transformedOrders = orders.map(order => {
      const items = order.products.map(prod => ({
        product: {
          ...prod.product,
          image: prod.product.image || 'placeholder.jpg',  // Use 'image' from model, fallback for missing
        },
        quantity: prod.quantity,
        price: prod.price || prod.product.price,  // Use order snapshot or product price
      }));

      return {
        ...order,
        items,
        total: order.totalAmount,
        date: order.createdAt,  // Expose for frontend date formatting
      };
    });

    res.status(200).json(transformedOrders);
  } catch (err) {
    console.error('Error in getAllOrders controller:', err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};