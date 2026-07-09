import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { FiBell, FiUser } from 'react-icons/fi';

const Header = () => {
  const { admin } = useAdminAuth();

  return (
    <header className="glass-header h-16 md:h-20 flex items-center justify-between px-6 md:px-8 sticky top-4 z-40 mx-4 mt-4 rounded-2xl animate-slideDown font-khmer">
      
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-[#6C8CFF] rounded-full animate-pulse"></div>
        <h2 className="text-xl font-moul text-gray-800 tracking-tight">ផ្ទាំងគ្រប់គ្រង</h2>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Notification Button */}
        <button className="p-2.5 bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/50 rounded-full transition-all duration-300 hover:shadow-md relative group">
          <FiBell className="text-xl text-gray-600 group-hover:text-[#6C8CFF] transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping opacity-75"></span>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/30">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#6C8CFF] to-[#8B5CF6] rounded-full flex items-center justify-center text-white shadow-md">
            <FiUser className="text-xl md:text-2xl" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-800 font-moul">{admin?.full_name || admin?.username || 'អ្នកគ្រប់គ្រង'}</p>
            <p className="text-[11px] text-gray-500 font-medium font-moul">អ្នកគ្រប់គ្រង</p>
          </div>
        </div>

      </div>

      {/* CSS Keyframes & Glass Utility Classes */}
      <style>{`
        /* ប្រើប្រាស់ Glass Effect ដូច Dashboard */
        .glass-header {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </header>
  );
};

export default Header;