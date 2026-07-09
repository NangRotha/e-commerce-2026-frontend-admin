import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { FiLock, FiUser, FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#6C8CFF] flex items-center justify-center p-6 relative overflow-hidden animate-fadeIn">
      
      {/* Background Decorative Blob Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl pointer-events-none animate-floatBlob1"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl pointer-events-none animate-floatBlob2"></div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row animate-slideUp">
        
        {/* ========== LEFT SIDE ========== */}
        <div className="w-full md:w-[45%] bg-[#6C8CFF] p-12 md:p-14 flex flex-col justify-between relative text-white min-h-[400px] md:min-h-[600px]">
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse hover:scale-110 transition-transform duration-300">
              <FiShoppingBag className="text-white text-lg" />
            </div>
            <span className="text-lg font-semibold tracking-wide font-moul">MarketPlace</span>
          </div>
          <div className="my-auto z-10">
            <h1 className="text-[2.5rem] md:text-[3.5rem] font-bold leading-[1.1] mb-6 font-moul animate-slideLeft">
              គ្រប់គ្រងហាង <br />
              របស់អ្នកយ៉ាងងាយ <br />
              ស្រួល!
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xs leading-relaxed font-moul animate-fadeIn delay-200">
              ចូលប្រើប្រាស់ប្រព័ន្ធគ្រប់គ្រងផ្ទៃក្នុង ដើម្បីគ្រប់គ្រងផលិតផល ការបញ្ជាទិញ និងអតិថិជនរបស់អ្នក។
            </p>
          </div>
          <div className="relative w-full h-[250px] md:h-[320px] mt-4 md:mt-0 flex items-end justify-center z-10 animate-zoomIn delay-300">
            <img 
              src="https://app.safe-crm.com/assets/images/auth/gif1.gif" 
              alt="Data Management 3D" 
              className="w-full max-w-[350px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* ========== RIGHT SIDE ========== */}
        <div className="w-full md:w-[55%] bg-white p-10 md:p-14 flex flex-col justify-center animate-slideRight">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-[2.5rem] font-moul text-gray-900 mb-8 animate-fadeIn delay-100">ចូលប្រើប្រាស់</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 animate-fadeIn delay-200">
                <label className="block text-sm font-moul text-gray-600 ml-1">ឈ្មោះអ្នកប្រើប្រាស់</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiUser size={20} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="ឧ. admin_marketplace"
                    className="w-full pl-12 pr-5 py-4 bg-[#F8F9FA] border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-[#6C8CFF] focus:ring-2 focus:ring-[#6C8CFF]/20 transition-all duration-300 placeholder-gray-400"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2 animate-fadeIn delay-300">
                <label className="block text-sm font-moul text-gray-600 ml-1">ពាក្យសម្ងាត់</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiLock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="************"
                    className="w-full pl-12 pr-12 py-4 bg-[#F8F9FA] border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-[#6C8CFF] focus:ring-2 focus:ring-[#6C8CFF]/20 transition-all duration-300 placeholder-gray-400"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6C8CFF] transition-colors"
                  >
                    {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm animate-fadeIn delay-400 font-moul">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-[#6C8CFF] transition-colors">
                  <input type="checkbox" className="w-4 h-4 text-[#6C8CFF] focus:ring-[#6C8CFF] border-gray-300 rounded" defaultChecked />
                  ចងចាំខ្ញុំ
                </label>
                <a href="#" className="text-[#6C8CFF] font-moul hover:underline text-sm">ភ្លេចពាក្យសម្ងាត់?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6C8CFF] text-white py-4 rounded-2xl font-moul text-lg shadow-[0_4px_14px_rgba(108,140,255,0.4)] hover:shadow-[0_6px_20px_rgba(108,140,255,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'ចូលប្រើប្រាស់'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* CSS Keyframe Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fadeIn.delay-100 { animation-delay: 0.1s; opacity: 0; animation-fill-mode: forwards; }
        .animate-fadeIn.delay-200 { animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards; }
        .animate-fadeIn.delay-300 { animation-delay: 0.3s; opacity: 0; animation-fill-mode: forwards; }
        .animate-fadeIn.delay-400 { animation-delay: 0.4s; opacity: 0; animation-fill-mode: forwards; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.7s ease-out forwards; }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideRight { animation: slideRight 0.7s ease-out forwards; }

        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideLeft { animation: slideLeft 0.7s ease-out forwards; }

        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-zoomIn.delay-300 { animation: zoomIn 0.7s ease-out forwards; animation-delay: 0.3s; opacity: 0; animation-fill-mode: forwards; }

        @keyframes floatBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.1); }
        }
        .animate-floatBlob1 { animation: floatBlob1 6s ease-in-out infinite; }

        @keyframes floatBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.2); }
        }
        .animate-floatBlob2 { animation: floatBlob2 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AdminLogin;