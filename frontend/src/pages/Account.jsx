import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Gift, Ticket, CalendarDays, Wallet, HelpCircle, 
  Settings, LogOut, ChevronRight, Moon, Bell, Shield, Globe 
} from 'lucide-react';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-darkText mb-2">Welcome to VenueHub</h2>
          <p className="text-gray-500 mb-6 text-sm">Login to manage your bookings, rewards, and more.</p>
          <div className="flex flex-col gap-3">
            <Link to="/login" className="btn-primary py-3 rounded-full w-full">Login</Link>
            <Link to="/register" className="btn-secondary py-3 rounded-full w-full">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  const menuSections = [
    {
      title: "My Activity",
      items: [
        { icon: <CalendarDays size={20} className="text-blue-500" />, label: "My Bookings", subtitle: "Upcoming, Completed, Cancelled", path: "/bookings" },
        { icon: <Gift size={20} className="text-orange-500" />, label: "Reward Points", subtitle: `${user.rewardPoints || 0} Points Available`, path: "#" },
        { icon: <Ticket size={20} className="text-green-500" />, label: "Coupons & Offers", subtitle: `${user.coupons?.length || 0} Active Coupons`, path: "#" },
        { icon: <Wallet size={20} className="text-purple-500" />, label: "Wallet", subtitle: "Manage saved cards & UPI", path: "#" },
      ]
    },
    {
      title: "Settings",
      items: [
        { icon: <User size={20} className="text-gray-500" />, label: "Personal Details", subtitle: "Name, Mobile, Email, Address", path: "#" },
        { icon: <Moon size={20} className="text-indigo-500" />, label: "Dark Mode", subtitle: "Coming soon", path: "#" },
        { icon: <Bell size={20} className="text-yellow-500" />, label: "Notifications", subtitle: "Offers, Booking updates", path: "#" },
        { icon: <Shield size={20} className="text-emerald-500" />, label: "Privacy & Security", path: "#" },
        { icon: <Globe size={20} className="text-cyan-500" />, label: "Language", subtitle: "English", path: "#" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: <HelpCircle size={20} className="text-pink-500" />, label: "Help Centre & FAQs", subtitle: "Chat, Email, Call Support", path: "#" },
      ]
    }
  ];

  return (
    <div className="w-full pb-24 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white px-4 pt-8 pb-6 shadow-sm mb-2">
        <div className="flex items-center gap-4 max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-darkText">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="inline-block mt-1 bg-orange-100 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Reward Banner */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 mt-4 text-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold opacity-90">Current Reward Points</p>
            <p className="text-2xl font-bold mt-1 flex items-center gap-2">
              <Gift size={20} /> {user.rewardPoints || 0}
            </p>
          </div>
          <button className="bg-white text-primary text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            Redeem Now
          </button>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section, idx) => (
          <div key={idx} className="mt-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{section.title}</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx} 
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    itemIdx !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-darkText text-sm">{item.label}</p>
                      {item.subtitle && <p className="text-xs text-gray-400">{item.subtitle}</p>}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="mt-8 mb-4">
          <button 
            onClick={handleLogout}
            className="w-full bg-white border border-red-200 text-red-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
