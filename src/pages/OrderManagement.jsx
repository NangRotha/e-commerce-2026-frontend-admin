import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../services/adminApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiTruck, FiXCircle, FiPackage } from 'react-icons/fi';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('មិនអាចផ្ទុកការបញ្ជាទិញបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`បានធ្វើបច្ចុប្បន្នភាពស្ថានភាពការបញ្ជាទិញ #${orderId} ទៅ ${newStatus}`);
      loadOrders();
    } catch (error) {
      toast.error('មិនអាចធ្វើបច្ចុប្បន្នភាពស្ថានភាពបានទេ');
    }
  };

  // ផ្គូរផ្គងពណ៌ និង Icon តាមស្ថានភាព
  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: FiClock },
      confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FiCheckCircle },
      packing: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: FiPackage },
      shipping: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: FiTruck },
      delivered: { color: 'bg-green-100 text-green-700 border-green-200', icon: FiCheckCircle },
      cancelled: { color: 'bg-red-100 text-red-700 border-red-200', icon: FiXCircle },
    };
    return configs[status] || { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: FiClock };
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 bg-[#F8F9FA]">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-[#6C8CFF] border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F8F9FA] ml-[240px] p-6 md:p-8 font-khmer"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-moul text-gray-800">គ្រប់គ្រងការបញ្ជាទិញ</h1>
            <p className="text-gray-500 text-sm mt-1 font-khmer">តាមដាន និងគ្រប់គ្រងស្ថានភាពការបញ្ជាទិញទាំងអស់របស់ហាងអ្នក។</p>
          </div>
        </motion.div>

        {/* Orders Table (Glass Card) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden"
        >
          {orders.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-moul text-gray-600">មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</h3>
              <p className="text-gray-400 text-sm mt-2 font-khmer">អតិថិជននឹងចាប់ផ្តើមបញ្ជាទិញនៅពេលឆាប់ៗនេះ។</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-moul text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">លេខបញ្ជាទិញ</th>
                    <th className="px-6 py-4">អតិថិជន</th>
                    <th className="px-6 py-4">តម្លៃសរុប</th>
                    <th className="px-6 py-4">ស្ថានភាព</th>
                    <th className="px-6 py-4 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order, index) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <motion.tr 
                        key={order.id} 
                        variants={itemVariants}
                        whileHover={{ backgroundColor: '#F9FAFB' }}
                        className="transition-colors"
                      >
                        <td className="px-6 py-4 font-moul text-gray-800 font-medium">#{order.id}</td>
                        <td className="px-6 py-4 font-moul text-gray-600">{order.customer_name}</td>
                        <td className="px-6 py-4 font-moul text-gray-900 font-bold">${order.total_price?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                            <StatusIcon size={14} />
                            {order.status === 'pending' && 'កំពុងរង់ចាំ'}
                            {order.status === 'confirmed' && 'បានបញ្ជាក់'}
                            {order.status === 'packing' && 'កំពុងវេចខ្ចប់'}
                            {order.status === 'shipping' && 'កំពុងដឹកជញ្ជូន'}
                            {order.status === 'delivered' && 'បានបញ្ជូន'}
                            {order.status === 'cancelled' && 'បានលុបចោល'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select 
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-[#F4F6FA] border-none rounded-xl px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all cursor-pointer font-moul"
                          >
                            <option value="pending">កំពុងរង់ចាំ</option>
                            <option value="confirmed">បានបញ្ជាក់</option>
                            <option value="packing">កំពុងវេចខ្ចប់</option>
                            <option value="shipping">កំពុងដឹកជញ្ជូន</option>
                            <option value="delivered">បានបញ្ជូន</option>
                            <option value="cancelled">បានលុបចោល</option>
                          </select>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
};

export default OrderManagement;