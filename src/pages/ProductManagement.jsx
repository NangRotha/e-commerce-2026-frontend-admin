import { useState, useEffect } from 'react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadProductImage, uploadProductImages } from '../services/adminApi';
import { FiEdit2, FiTrash2, FiPlus, FiBox, FiBell, FiUser } from 'react-icons/fi';
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

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', discount: 0, category_id: '', brand: '', stock: 0
  });
  
  const [mainImageFile, setMainImageFile] = useState(null);
  const [subImageFiles, setSubImageFiles] = useState([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('មិនអាចផ្ទុកផលិតផលបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, description: product.description, price: product.price,
        discount: product.discount, category_id: product.category_id, brand: product.brand, stock: product.stock
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', discount: 0, category_id: '', brand: '', stock: 0 });
    }
    setMainImageFile(null);
    setSubImageFiles([]);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let productId;
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        productId = editingProduct.id;
        toast.success('បានធ្វើបច្ចុប្បន្នភាពផលិតផលដោយជោគជ័យ');
      } else {
        const res = await createProduct(formData);
        productId = res.data.id;
        toast.success('បានបង្កើតផលិតផលដោយជោគជ័យ');
      }

      if (mainImageFile) {
        const mainFormData = new FormData();
        mainFormData.append('file', mainImageFile);
        await uploadProductImage(productId, mainFormData);
      }

      if (subImageFiles.length > 0) {
        const subFormData = new FormData();
        subImageFiles.forEach((file) => {
          subFormData.append('files', file);
        });
        await uploadProductImages(productId, subFormData);
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      toast.error('មិនអាចរក្សាទុកផលិតផលបានទេ');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('តើអ្នកប្រាកដថាចង់លុបផលិតផលនេះមែនទេ?')) {
      try {
        await deleteProduct(id);
        toast.success('បានលុបផលិតផលដោយជោគជ័យ');
        loadProducts();
      } catch (error) {
        toast.error('មិនអាចលុបផលិតផលបានទេ');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#F8F9FA] ml-[240px]">
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
        
        {/* ==================== FLOATING HEADER ==================== */}
    

        {/* ==================== MAIN CONTENT HEADER ==================== */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-moul text-gray-800">គ្រប់គ្រងផលិតផល</h1>
            <p className="text-gray-500 text-sm mt-1 font-khmer">គ្រប់គ្រងផលិតផល ប្រភេទ និងរូបភាពរបស់ហាងអ្នក។</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenModal()} 
            className="bg-[#6C8CFF] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition shadow-md font-moul"
          >
            <FiPlus /> បន្ថែមផលិតផល
          </motion.button>
        </motion.div>

        {/* ==================== PRODUCTS TABLE ==================== */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden"
        >
          {products.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBox className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-moul text-gray-600">មិនទាន់មានផលិតផលនៅឡើយទេ</h3>
              <p className="text-gray-400 text-sm mt-2 font-khmer">ចុចប៊ូតុង "បន្ថែមផលិតផល" ដើម្បីចាប់ផ្តើម។</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-moul text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">រូបភាព</th>
                    <th className="px-6 py-4">ល.រ</th>
                    <th className="px-6 py-4">ឈ្មោះ</th>
                    <th className="px-6 py-4">តម្លៃ</th>
                    <th className="px-6 py-4">ស្តុក</th>
                    <th className="px-6 py-4 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product, index) => (
                    <motion.tr 
                      key={product.id} 
                      variants={itemVariants}
                      whileHover={{ backgroundColor: '#F9FAFB' }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {product.images && product.images.length > 0 ? (
                            product.images.slice(0, 2).map((img, i) => (
                              <img key={i} src={img.image_url} alt={`${product.name} ${i}`} className="w-10 h-10 rounded-lg object-cover border border-gray-200" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50"; }} />
                            ))
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-moul">គ្មាន</div>
                          )}
                          {product.images && product.images.length > 2 && <span className="text-xs text-gray-400 self-center ml-1">+{product.images.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-moul text-gray-500">#{product.id}</td>
                      <td className="px-6 py-4 font-moul font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 font-moul text-gray-900">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 font-moul text-gray-900">{product.stock}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenModal(product)} 
                            className="p-2 text-[#6C8CFF] hover:bg-blue-50 rounded-lg transition"
                          >
                            <FiEdit2 className="text-lg" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product.id)} 
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

        {/* ==================== MODAL FORM ==================== */}
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
                  {editingProduct ? 'កែសម្រួលផលិតផល' : 'បន្ថែមផលិតផលថ្មី'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">ឈ្មោះផលិតផល</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-moul text-gray-700 mb-2">តម្លៃ ($)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        required 
                        value={formData.price} 
                        onChange={(e) => setFormData({...formData, price: e.target.value})} 
                        className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-moul text-gray-700 mb-2">ស្តុក</label>
                      <input 
                        type="number" 
                        value={formData.stock} 
                        onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                        className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">ប្រភេទ</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300"
                    >
                      <option value="">ជ្រើសរើសប្រភេទ</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">ការពិពណ៌នា</label>
                    <textarea 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                      rows="2"
                    ></textarea>
                  </div>

                  {/* Main Image Upload */}
                  <div className="border-t border-gray-100 pt-4">
                    <label className="block text-sm font-moul text-gray-700 mb-2">រូបភាពចម្បង (ផ្ទុកពីកុំព្យូទ័រ)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setMainImageFile(e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-moul file:bg-[#6C8CFF] file:text-white hover:file:bg-blue-600 transition-all duration-300"
                    />
                    {mainImageFile && <p className="text-xs text-green-600 mt-1 font-moul">✅ បានជ្រើសរើស: {mainImageFile.name}</p>}
                  </div>

                  {/* Sub Images Upload */}
                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">រូបភាពរង (ជ្រើសរើសច្រើន)</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => setSubImageFiles(Array.from(e.target.files))}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-moul file:bg-[#8B5CF6] file:text-white hover:file:bg-purple-700 transition-all duration-300"
                    />
                    {subImageFiles.length > 0 && <p className="text-xs text-green-600 mt-1 font-moul">✅ {subImageFiles.length} រូបភាពត្រូវបានជ្រើសរើស</p>}
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

      {/* CSS Keyframes Animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; animation-fill-mode: forwards; }
      `}</style>
    </motion.div>
  );
};

export default ProductManagement;