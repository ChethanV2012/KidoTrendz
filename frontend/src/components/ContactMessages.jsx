import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../../stores/useUserStore'; // Adjust path
import { Trash2 } from 'lucide-react'; // For delete icon
import { toast } from 'react-hot-toast';
import axios from '../../lib/axios'; // Use Axios for consistency with store

const ContactMessages = () => {
  const { user } = useUserStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      setError('Access denied: Admin privileges required.');
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setError(null);
        const response = await axios.get('/api/contact-messages');
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Fetch messages error:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          // Trigger logout via store
          useUserStore.getState().logout();
        } else if (error.response?.status === 403) {
          setError('Access denied: Insufficient permissions.');
        } else {
          setError('Failed to load messages. Please try again.');
          toast.error('Failed to load messages');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await axios.delete(`/api/contact-messages/${id}`);
      setMessages(messages.filter(msg => msg._id !== id));
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        useUserStore.getState().logout();
      } else {
        toast.error('Delete failed. Please try again.');
      }
    }
  };

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 p-6 rounded-lg text-center"
      >
        <p className="text-red-500 mb-4">Access denied</p>
        <p className="text-gray-400 text-sm">Admin privileges required to view contact messages.</p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 p-6 rounded-lg text-center"
      >
        <p className="text-gray-300">Loading messages...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 p-6 rounded-lg text-center"
      >
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()} // Simple retry
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 p-6 rounded-lg"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Contact Messages ({messages.length})</h2>
      {messages.length === 0 ? (
        <p className="text-gray-400">No messages yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2 font-medium">{msg.name}</td>
                  <td className="px-4 py-2">{msg.email}</td>
                  <td className="px-4 py-2">{msg.subject}</td>
                  <td className="px-4 py-2 max-w-xs truncate" title={msg.message}>
                    {msg.message}
                  </td>
                  <td className="px-4 py-2 text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1 rounded"
                      title="Delete message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ContactMessages;