import { useState, useEffect } from 'react';
import { getBanners, createBanner, updateBanner, deleteBanner, toggleBannerStatus, uploadBannerImage } from '../services/adminApi';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiEyeOff, FiImage, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const getBannerImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
  return `${baseUrl}${url}`;
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

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', subtitle: '', image_url: '', link: '', is_active: true
  });
  
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await getBanners();
      setBanners(response.data);
    } catch (error) {
      toast.error('មិនអាចផ្ទុកផ្ទាំងរូបភាពបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title, 
        subtitle: banner.subtitle || '', 
        image_url: banner.image_url, 
        link: banner.link || '',
        is_active: banner.is_active
      });
    } else {
      setEditingBanner(null);
      setFormData({ title: '', subtitle: '', image_url: '', link: '', is_active: true });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let bannerId;
      if (editingBanner) {
        await updateBanner(editingBanner.id, formData);
        bannerId = editingBanner.id;
        toast.success('បានធ្វើបច្ចុប្បន្នភាពផ្ទាំងរូបភាព');
      } else {
        const res = await createBanner(formData);
        bannerId = res.data.id;
        toast.success('បានបង្កើតផ្ទាំងរូបភាពថ្មី');
      }

      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', imageFile);
        await uploadBannerImage(bannerId, formDataUpload);
        toast.success('បានផ្ទុករូបភាពដោយជោគជ័យ');
      }

      setIsModalOpen(false);
      loadBanners();
    } catch (error) {
      toast.error('មិនអាចរក្សាទុកផ្ទាំងរូបភាពបានទេ');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('តើអ្នកប្រាកដថាចង់លុបផ្ទាំងរូបភាពនេះមែនទេ?')) {
      try {
        await deleteBanner(id);
        toast.success('បានលុបផ្ទាំងរូបភាពដោយជោគជ័យ');
        loadBanners();
      } catch (error) {
        toast.error('មិនអាចលុបផ្ទាំងរូបភាពបានទេ');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleBannerStatus(id);
      toast.success(`ផ្ទាំងរូបភាព ${currentStatus ? 'បានលាក់' : 'បានបង្ហាញ'}`);
      loadBanners();
    } catch (error) {
      toast.error('មិនអាចផ្លាស់ប្តូរស្ថានភាពបានទេ');
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
            <h1 className="text-3xl font-moul text-gray-800">គ្រប់គ្រងផ្ទាំងរូបភាព</h1>
            <p className="text-gray-500 text-sm mt-1 font-khmer">គ្រប់គ្រងផ្ទាំងរូបភាព និងការផ្សព្វផ្សាយរបស់ហាងអ្នក។</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenModal()} 
            className="bg-[#6C8CFF] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition shadow-md font-moul"
          >
            <FiPlus /> បន្ថែមផ្ទាំងរូបភាព
          </motion.button>
        </motion.div>

        {/* Banners Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {banners.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiImage className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-moul text-gray-600">មិនទាន់មានផ្ទាំងរូបភាពនៅឡើយទេ</h3>
              <p className="text-gray-400 text-sm mt-2 font-khmer">ចុចប៊ូតុង "បន្ថែមផ្ទាំងរូបភាព" ដើម្បីចាប់ផ្តើម។</p>
            </div>
          ) : (
            banners.map((banner) => (
              <motion.div 
                key={banner.id} 
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0px 10px 25px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden group relative"
              >
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                  banner.is_active 
                    ? 'bg-green-100/80 text-green-700 border-green-200' 
                    : 'bg-red-100/80 text-red-700 border-red-200'
                }`}>
                  {banner.is_active ? 'សកម្ម' : 'អសកម្ម'}
                </div>

                {/* Image */}
                <div className="h-48 bg-gray-100 overflow-hidden relative">
                  {banner.image_url ? (
                    <img 
                      src={getBannerImageUrl(banner.image_url)} 
                      alt={banner.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm font-moul">គ្មានរូបភាព</div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-moul text-lg text-gray-800 group-hover:text-[#6C8CFF] transition-colors">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-gray-500 text-sm mt-1 font-khmer line-clamp-2">{banner.subtitle}</p>
                  )}
                  {banner.link && (
                    <a 
                      href={banner.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 text-[#6C8CFF] text-xs hover:underline mt-2 font-moul"
                    >
                      <FiExternalLink size={14} /> ចូលមើលតំណ
                    </a>
                  )}
                  
                  {/* Actions */}
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleToggleStatus(banner.id, banner.is_active)}
                      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                        banner.is_active 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={banner.is_active ? 'លាក់' : 'បង្ហាញ'}
                    >
                      {banner.is_active ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                    </button>
                    <button 
                      onClick={() => handleOpenModal(banner)} 
                      className="p-2 text-[#6C8CFF] hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(banner.id)} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* MODAL FORM */}
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
                  {editingBanner ? 'កែសម្រួលផ្ទាំងរូបភាព' : 'បន្ថែមផ្ទាំងរូបភាពថ្មី'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">ចំណងជើង *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">ចំណងជើងរង</label>
                    <input 
                      type="text" 
                      value={formData.subtitle} 
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-moul text-gray-700 mb-2">តំណភ្ជាប់ (ស្រេចចិត្ត)</label>
                    <input 
                      type="text" 
                      value={formData.link} 
                      onChange={(e) => setFormData({...formData, link: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#F4F6FA] border-none rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6C8CFF] transition-all duration-300" 
                    />
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
                    {!imageFile && editingBanner?.image_url && (
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

export default BannerManagement;