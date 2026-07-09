import { useState, useEffect } from 'react';
import { getUsers, toggleUserBlock } from '../services/adminApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiCheckCircle, FiXCircle, FiEdit2 } from 'react-icons/fi';

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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('មិនអាចផ្ទុកអ្នកប្រើប្រាស់បានទេ');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId) => {
    try {
      await toggleUserBlock(userId);
      toast.success('បានធ្វើបច្ចុប្បន្នភាពស្ថានភាពអ្នកប្រើប្រាស់');
      loadUsers();
    } catch (error) {
      toast.error('មិនអាចធ្វើបច្ចុប្បន្នភាពអ្នកប្រើប្រាស់បានទេ');
    }
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
            <h1 className="text-3xl font-moul text-gray-800">គ្រប់គ្រងអ្នកប្រើប្រាស់</h1>
            <p className="text-gray-500 text-sm mt-1 font-khmer">គ្រប់គ្រងគណនីអ្នកប្រើប្រាស់ និងស្ថានភាពសកម្មភាពរបស់ពួកគេ។</p>
          </div>
        </motion.div>

        {/* Users Table (Glass Card) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden"
        >
          {users.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-moul text-gray-600">មិនទាន់មានអ្នកប្រើប្រាស់នៅឡើយទេ</h3>
              <p className="text-gray-400 text-sm mt-2 font-khmer">អ្នកប្រើប្រាស់នឹងចុះឈ្មោះនៅពេលឆាប់ៗនេះ។</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-moul text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">ល.រ</th>
                    <th className="px-6 py-4">ឈ្មោះអ្នកប្រើ</th>
                    <th className="px-6 py-4">អ៊ីមែល</th>
                    <th className="px-6 py-4">ស្ថានភាព</th>
                    <th className="px-6 py-4 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user, index) => (
                    <motion.tr 
                      key={user.id} 
                      variants={itemVariants}
                      whileHover={{ backgroundColor: '#F9FAFB' }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4 font-moul text-gray-500">#{user.id}</td>
                      <td className="px-6 py-4 font-moul font-medium text-gray-900">{user.username}</td>
                      <td className="px-6 py-4 font-moul text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          user.is_active 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {user.is_active ? <FiCheckCircle size={14} /> : <FiXCircle size={14} />}
                          {user.is_active ? 'សកម្ម' : 'បានរារាំង'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toggleBlock(user.id)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.05] ${
                            user.is_active 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800'
                          }`}
                        >
                          {user.is_active ? 'រារាំង' : 'ដោះរារាំង'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
};

export default UserManagement;