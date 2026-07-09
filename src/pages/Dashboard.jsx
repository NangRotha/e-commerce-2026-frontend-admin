import { useState, useEffect } from 'react';
import { getDashboard } from '../services/adminApi';
import { 
  FiDollarSign, FiBox, FiUsers, FiTrendingUp, FiTrendingDown, 
  FiMoreHorizontal, FiCalendar, FiUser
} from 'react-icons/fi';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_users: 0,
      total_sales: 0,
      profit: 0,
      invoices: 0,
    },
    invoice_stats: {
      paid: 0,
      overdue: 0,
      unpaid: 0,
    },
    sales_labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    sales_data: [10, 20, 15, 30, 25, 45, 35, 30, 40, 35, 50, 40],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await getDashboard();
      if (response && response.data) {
        const data = response.data;
        setDashboardData({
          stats: {
            total_users: data.total_users || data.users_count || 3,
            total_sales: data.total_sales || data.sales_total || 0,
            profit: data.profit || 0,
            invoices: data.total_invoices || data.invoices_count || 0,
          },
          invoice_stats: {
            paid: data.paid_invoices || 0,
            overdue: data.overdue_invoices || 0,
            unpaid: data.unpaid_invoices || 0,
          },
          sales_labels: data.sales_labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          sales_data: data.sales_data || [10, 20, 15, 30, 25, 45, 35, 30, 40, 35, 50, 40],
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // 4 Cards តាមគំរូ
  const stats = [
    { 
      title: 'អតិថិជនសរុប', 
      value: dashboardData.stats.total_users, 
      icon: FiUsers, 
      trend: '+6.5%', 
      trendUp: true,
      iconBg: 'bg-blue-100 text-blue-500' 
    },
    { 
      title: 'ចំណូលសរុប', 
      value: `$${(dashboardData.stats.total_sales || 0).toFixed(2)}`, 
      icon: FiDollarSign, 
      trend: '-0.10%', 
      trendUp: false,
      iconBg: 'bg-green-100 text-green-500'
    },
    { 
      title: 'ប្រាក់ចំណេញ', 
      value: `${dashboardData.stats.profit || 0}%`, 
      icon: FiTrendingUp, 
      trend: '-0.2%', 
      trendUp: false,
      iconBg: 'bg-purple-100 text-purple-500'
    },
    { 
      title: 'វិក្កយបត្រ', 
      value: dashboardData.stats.invoices, 
      icon: FiBox, 
      trend: '+11.5%', 
      trendUp: true,
      iconBg: 'bg-cyan-100 text-cyan-600'
    },
  ];

  const invoiceStats = dashboardData.invoice_stats;
  const totalInvoices = invoiceStats.paid + invoiceStats.overdue + invoiceStats.unpaid;
  const paidPercent = totalInvoices > 0 ? (invoiceStats.paid / totalInvoices) * 100 : 0;
  const overduePercent = totalInvoices > 0 ? (invoiceStats.overdue / totalInvoices) * 100 : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F9FA] ml-[240px]">
        <div className="w-12 h-12 border-4 border-[#6C8CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] ml-[240px] p-6 md:p-8 font-sans animate-fadeIn relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
       

        {/* ==================== WELCOME & DATE ==================== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              សួស្តី, Admin <span className="text-2xl">👋</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">របាយការណ៍សង្ខេបនៃដំណើរការហាងរបស់អ្នកសម្រាប់ថ្ងៃនេះ</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <FiCalendar className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* ==================== 4 STATS CARDS ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-6 transition-all duration-300 hover:-translate-y-1 animate-slideUp border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.iconBg} p-3 rounded-xl`}>
                  <stat.icon className="text-2xl" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  {stat.trendUp ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ==================== CHARTS ROW ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Invoice Statistics */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-6 border border-gray-100 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">ស្ថិតិវិក្កយបត្រ</h3>
              <button className="text-gray-400 hover:text-gray-600"><FiMoreHorizontal size={20} /></button>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Donut Chart - រចនាថ្មីដោយប្រើ CSS conic-gradient */}
              <div className="relative w-36 h-36 flex-shrink-0">
                <div className="w-full h-full rounded-full" 
                  style={{ 
                    background: `conic-gradient(
                      #6C8CFF 0% ${paidPercent}%, 
                      #8B5CF6 ${paidPercent}% ${paidPercent + overduePercent}%, 
                      #D1D5DB ${paidPercent + overduePercent}% 100%
                    )`
                  }}
                >
                  <div className="absolute inset-0 m-1.5 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">{totalInvoices}</span>
                    <span className="text-[10px] text-gray-400 font-medium">វិក្កយបត្រ</span>
                  </div>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#6C8CFF]"></div> <span className="text-sm text-gray-600">បានបង់</span></div>
                  <span className="font-bold text-gray-800">{invoiceStats.paid}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div> <span className="text-sm text-gray-600">ហួសកំណត់</span></div>
                  <span className="font-bold text-gray-800">{invoiceStats.overdue}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-gray-300"></div> <span className="text-sm text-gray-600">មិនទាន់បង់</span></div>
                  <span className="font-bold text-gray-800">{invoiceStats.unpaid}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sales Analytics */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-6 border border-gray-100 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">ការវិភាគការលក់</h3>
              <button className="text-gray-400 hover:text-gray-600"><FiMoreHorizontal size={20} /></button>
            </div>
            
            <div className="h-48 relative w-full overflow-hidden flex items-end justify-between px-2 pt-4 pb-2">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C8CFF" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#6C8CFF" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path 
                  d={dashboardData.sales_data.length > 0 ? 
                    dashboardData.sales_data.map((val, i) => {
                      const x = (i / (dashboardData.sales_data.length - 1)) * 600;
                      const y = 70 - (val / 60) * 40;
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                    }).join(' ') : 
                    'M0,70 L50,40 L100,60 L150,30 L200,80 L250,20 L300,50 L350,25 L400,70 L450,40 L500,65 L550,30 L600,70'
                  } 
                  fill="url(#chartGradient)" 
                  stroke="#6C8CFF" 
                  strokeWidth="2.5" 
                  className="drop-shadow-sm"
                />
              </svg>
              <div className="flex justify-between w-full text-[10px] text-gray-400 font-medium pt-2 relative z-10">
                {dashboardData.sales_labels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RECENT INVOICES TABLE (Empty State) ==================== */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100 animate-slideUp" style={{ animationDelay: '0.5s' }}>
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4 md:mb-0"></h3> {/* Empty title */}
            <div className="flex items-center gap-3 ml-auto">
              <button className="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition shadow-sm font-medium">
                តម្រង
              </button>
              <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition"><FiMoreHorizontal size={18} className="text-gray-500" /></button>
            </div>
          </div>
          
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 text-xs tracking-wider font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">អតិថិជន</th>
                  <th className="px-6 py-4">ទំនិញ</th>
                  <th className="px-6 py-4">កាលបរិច្ឆេទ</th>
                  <th className="px-6 py-4">ស្ថានភាព</th>
                  <th className="px-6 py-4 text-right">តម្លៃ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-gray-400 text-sm font-medium">
                    មិនទាន់មានវិក្កយបត្រថ្មីៗនៅឡើយទេ។
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CSS Keyframes Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; animation-fill-mode: forwards; }
      `}</style>
    </div>
  );
};

export default Dashboard;