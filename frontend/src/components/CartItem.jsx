// components/CartItem.jsx (Full Updated Component - Remove Description, Show Size, ₹)
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Trash2 } from "lucide-react";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item._id);
    } else {
      updateQuantity(item._id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item._id);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <motion.div
      className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800 space-x-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{item.name}</h3>
        {/* Removed: Any product description (e.g., <p>{item.description}</p>) */}
        <p className="text-sm text-gray-400">Size: {item.size || 'N/A'}</p> {/* New: Display selected size */}
        <p className="text-sm text-emerald-400">₹{item.price.toFixed(2)}</p> {/* Changed to ₹ */}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="px-2 py-1 border rounded text-sm hover:bg-gray-700"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="px-2 py-1 border rounded text-sm hover:bg-gray-700"
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="font-semibold text-white">₹{itemTotal.toFixed(2)}</p> {/* Changed to ₹ */}
      </div>
      <button onClick={handleRemove} className="text-red-400 hover:text-red-300">
        <Trash2 size={20} />
      </button>
    </motion.div>
  );
};

export default CartItem;