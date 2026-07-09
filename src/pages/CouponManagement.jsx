import { useState, useEffect } from 'react';
import { getCoupons, createCoupon, deleteCoupon } from '../services/adminApi';
import { FiTrash2, FiPlus, FiTag, FiCalendar, FiPercent, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    code: '', 
    discount_percent: '', 
    expire_date: '' 
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await getCoupons();
      setCoupons(response.data);
    } catch (error) {
      toast.error('មិនអាចផ្ទុកប័ណ្ណបញ្ចុះតម្លៃបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCoupon(formData);
      toast.success('បានបង្កើតប័ណ្ណបញ្ចុះតម្លៃថ្មី');
      setIsModalOpen(false);
      setFormData({ code: '', discount_percent: '', expire_date: '' });
      loadCoupons();
    } catch (error) {
      console.error(error);
      toast.error('មិនអាចបង្កើតប័ណ្ណបញ្ចុះតម្លៃបានទេ');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('តើអ្នកប្រាកដថាចង់លុបប័ណ្ណបញ្ចុះតម្លៃនេះមែនទេ?')) {
      try {
        await deleteCoupon(id);
        toast.success('បានលុបប័ណ្ណបញ្ចុះតម្លៃដោយជោគជ័យ');
        loadCoupons();
      } catch (error) {
        toast.error('មិនអាចលុបប័ណ្ណបញ្ចុះតម្លៃបានទេ');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 bg-[#F8F9FA] ml-[240px]">
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
        
        {/* Header & Actions */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-moul text-gray-800">គ្រប់គ្រងប័ណ្ណបញ្ចុះតម្លៃ</h1>
            <p className="text-gray-500 text-sm mt-1 font-khmer">គ្រប់គ្រងប័ណ្ណបញ្ចុះតម្លៃ និងការផ្សព្វផ្សាយរបស់ហាងអ្នក។</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)} 
            className="bg-[#6C8CFF] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition shadow-md font-moul"
          >
            <FiPlus /> បន្ថែមប័ណ្ណបញ្ចុះតម្លៃ
          </motion.button>
        </motion.div>

        {/* Coupons Table */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden"
        >
          {coupons.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTag className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-moul text-gray-600">មិនទាន់មានប័ណ្ណបញ្ចុះតម្លៃនៅឡើយទេ</h3>
              <p className="text-gray-400 text-sm mt-2 font-khmer">ចុចប៊ូតុង "បន្ថែមប័ណ្ណបញ្ចុះតម្លៃ" ដើម្បីចាប់ផ្តើម។</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-moul text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">លេខកូដ</th>
                    <th className="px-6 py-4">បញ្ចុះតម្លៃ</th>
                    <th className="px-6 py-4">កាលបរិច្ឆេទផុតកំណត់</th>
                    <th className="px-6 py-4">ស្ថានភាព</th>
                    <th className="px-6 py-4 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons.map((coupon) => (
                    <motion.tr 
                      key={coupon.id} 
                      variants={itemVariants}
                      whileHover={{ backgroundColor: '#F9FAFB' }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4 font-moul font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <FiTag className="text-[#6C8CFF]" />
                          {coupon.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-moul text-gray-600 font-bold">
                        {coupon.discount_percent}%
                      </td>
                      <td className="px-6 py-4 font-moul text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          {new Date(coupon.expire_date).toLocaleDateString('km-KH')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          coupon.is_active 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {coupon.is_active ? <FiCheckCircle size={14} /> : <FiXCircle size={14} />}
                          {coupon.is_active ? 'សកម្ម' : 'អសកម្ម'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(coupon.id)} 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 className="text-lg" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Add Coupon Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-10 px-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-moul text-gray-800 mb-6 border-b border-gray-100 pb-4">
                  បន្ថែមប័ណ្ណបញ្ចុះតម្លៃថ្មី
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">លេខកូដប័ណ្ណ</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.code} 
                      onChange={(e) => setFormData({...formData, code: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">ភាគរយបញ្ចុះតម្លៃ (%)</label>
                    <div className="relative">
                      <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="number" 
                        required 
                        min="1" 
                        max="100" 
                        value={formData.discount_percent} 
                        onChange={(e) => setFormData({...formData, discount_percent: e.target.value})} 
                        className="w-full pl-12 pr-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">កាលបរិច្ឆេទផុតកំណត់</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="date" 
                        required 
                        value={formData.expire_date} 
                        onChange={(e) => setFormData({...formData, expire_date: e.target.value})} 
                        className="w-full pl-12 pr-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100 mt-2">
                    <motion.button 
                      type="submit" 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-[#6C8CFF] text-white py-3.5 rounded-xl font-moul shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      រក្សាទុក
                    </motion.button>
                    <motion.button 
                      type="button" 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsModalOpen(false)} 
                      className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-moul hover:bg-gray-200 transition"
                    >
                      បោះបង់
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CouponManagement;