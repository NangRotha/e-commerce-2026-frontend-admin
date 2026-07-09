import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiBox, FiList, FiShoppingBag, 
  FiUsers, FiImage, FiTag, FiLogOut 
} from 'react-icons/fi';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAdminAuth();

  // បកប្រែ Menu ជាភាសាខ្មែរ ដើម្បីឱ្យត្រូវនឹង Dashboard
  const menuItems = [
    { name: 'ផ្ទាំងគ្រប់គ្រង', icon: FiHome, path: '/admin' },
    { name: 'ផលិតផល', icon: FiBox, path: '/admin/products' },
    { name: 'ប្រភេទ', icon: FiList, path: '/admin/categories' },
    { name: 'ការបញ្ជាទិញ', icon: FiShoppingBag, path: '/admin/orders' },
    { name: 'អ្នកប្រើប្រាស់', icon: FiUsers, path: '/admin/users' },
    { name: 'ផ្ទាំងរូបភាព', icon: FiImage, path: '/admin/banners' },
    { name: 'ប័ណ្ណបញ្ចុះតម្លៃ', icon: FiTag, path: '/admin/coupons' },
  ];

  return (
    <aside className="w-[240px] bg-white fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-gray-100 pt-6 pb-4 font-khmer shadow-sm">
      
      {/* Logo Area - ប្តូរពណ៌ទៅជាខៀវ និងបន្ថែម Animation តូចមួយនៅពេល Hover */}
      <div className="px-6 mb-8 transition-transform duration-300 hover:scale-[1.02]">
        <h1 className="text-2xl font-moul text-[#6C8CFF] tracking-tight">MarketPlace</h1>
        <p className="text-[11px] text-gray-400 mt-0.5 font-medium font-moul">ផ្ទាំងគ្រប់គ្រង</p>
      </div>

      {/* Navigation Menu - បន្ថែម Stagger Animation និង Hover Scale */}
      <nav className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-[#6C8CFF]/10 text-[#6C8CFF] shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#6C8CFF] hover:scale-[1.02]'
              }`}
              style={{ animationDelay: `${index * 0.08}s` }} // ពន្យារពេល 0.08s សម្រាប់ Menu នីមួយៗ
            >
              <item.icon className={`text-xl transition-colors duration-300 ${isActive ? 'text-[#6C8CFF]' : 'text-gray-500 group-hover:text-[#6C8CFF]'}`} />
              <span className="font-moul text-sm tracking-wide">{item.name}</span>
              
              {/* Active Indicator - ចំណុចពណ៌ខៀវតូចនៅខាងស្តាំពេល Active */}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-[#6C8CFF] rounded-full animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button - បន្ថែម Animation Hover កាន់តែស្រស់ស្អាត */}
      <div className="px-4 mt-auto pt-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group hover:scale-[1.02]"
        >
          <FiLogOut className="text-xl group-hover:translate-x-1 transition-transform" />
          <span className="font-moul text-sm font-medium">ចេញពីប្រព័ន្ធ</span>
        </button>
      </div>

      {/* CSS Keyframe Animations (បន្ថែម Stagger និង Fade In) */}
      <style>{`
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        aside {
          animation: slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* បន្ថែម Stagger Animation ទៅលើ Link នីមួយៗ */
        nav a {
          opacity: 0;
          animation: fadeInUp 0.4s ease-out forwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;