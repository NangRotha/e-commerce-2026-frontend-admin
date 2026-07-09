import { useState, useEffect } from 'react';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  uploadCategoryImage
} from '../services/adminApi';
import { FiEdit2, FiTrash2, FiPlus, FiFolder } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function for images
const getImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : url;
};

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

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('មិនអាចផ្ទុកប្រភេទបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name, 
        description: category.description || '', 
        image_url: category.image_url || '' 
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', image_url: '' });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let categoryId;
      
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        categoryId = editingCategory.id;
        toast.success('បានធ្វើបច្ចុប្បន្នភាពប្រភេទ');
      } else {
        const res = await createCategory(formData);
        categoryId = res.data.id;
        toast.success('បានបង្កើតប្រភេទថ្មី');
      }

      // Upload Image if selected
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        await uploadCategoryImage(categoryId, uploadFormData);
        toast.success('បានផ្ទុករូបភាពដោយជោគជ័យ');
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      toast.error('មិនអាចរក្សាទុកប្រភេទបានទេ');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('តើអ្នកប្រាកដថាចង់លុបប្រភេទនេះមែនទេ?')) {
      try {
        await deleteCategory(id);
        toast.success('បានលុបប្រភេទដោយជោគជ័យ');
        loadCategories();
      } catch (error) {
        toast.error('មិនអាចលុបប្រភេទបានទេ');
      }
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
        
        {/* Header & Actions */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-moul text-gray-800">គ្រប់គ្រងប្រភេទ</h1>
            <p className="text-gray-500 text-sm mt-1 font-khmer">គ្រប់គ្រងប្រភេទផលិតផល និងរូបភាពរបស់ហាងអ្នក។</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenModal()} 
            className="bg-[#6C8CFF] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition shadow-md font-moul"
          >
            <FiPlus /> បន្ថែមប្រភេទ
          </motion.button>
        </motion.div>

        {/* Categories Table (Glass Card) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden"
        >
          {categories.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFolder className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-moul text-gray-600">មិនទាន់មានប្រភេទនៅឡើយទេ</h3>
              <p className="text-gray-400 text-sm mt-2 font-khmer">ចុចប៊ូតុង "បន្ថែមប្រភេទ" ដើម្បីចាប់ផ្តើម។</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-moul text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">រូបភាព</th>
                    <th className="px-6 py-4">ល.រ</th>
                    <th className="px-6 py-4">ឈ្មោះ</th>
                    <th className="px-6 py-4">ការពិពណ៌នា</th>
                    <th className="px-6 py-4 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat, index) => (
                    <motion.tr 
                      key={cat.id} 
                      variants={itemVariants}
                      whileHover={{ backgroundColor: '#F9FAFB' }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4">
                        {cat.image_url ? (
                          <img 
                            src={getImageUrl(cat.image_url)} 
                            alt={cat.name} 
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200" 
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50"; }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-moul">គ្មាន</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-moul text-gray-500">#{cat.id}</td>
                      <td className="px-6 py-4 font-moul font-medium text-gray-900">{cat.name}</td>
                      <td className="px-6 py-4 font-moul text-gray-600">{cat.description || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenModal(cat)} 
                            className="p-2 text-[#6C8CFF] hover:bg-blue-50 rounded-lg transition"
                          >
                            <FiEdit2 className="text-lg" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(cat.id)} 
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <FiTrash2 className="text-lg" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Modal Form */}
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
                  {editingCategory ? 'កែសម្រួលប្រភេទ' : 'បន្ថែមប្រភេទថ្មី'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">ឈ្មោះប្រភេទ</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">ការពិពណ៌នា</label>
                    <textarea 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                      rows="3"
                    ></textarea>
                  </div>
                  
                  {/* Image Upload */}
                  <div className="border-t border-gray-100 pt-4">
                    <label className="block text-sm font-moul text-gray-700 mb-2">ផ្ទុករូបភាព (ពីកុំព្យូទ័រ)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-moul file:bg-[#6C8CFF] file:text-white hover:file:bg-blue-600 transition-all duration-300"
                    />
                    {imageFile && <p className="text-xs text-green-600 mt-1 font-moul">✅ បានជ្រើសរើស: {imageFile.name}</p>}
                    {!imageFile && editingCategory?.image_url && (
                      <p className="text-xs text-blue-600 mt-1 font-moul">ℹ️ រូបភាពបច្ចុប្បន្នបានរក្សាទុក។ ផ្ទុកឯកសារថ្មីដើម្បីជំនួសវា។</p>
                    )}
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

export default CategoryManagement;