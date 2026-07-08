import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Grid, Calendar, User } from 'lucide-react';

const BottomNavigation = () => {
  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Home' },
    { path: '/wishlist', icon: <Heart size={24} />, label: 'Wishlist' },
    { path: '/categories', icon: <Grid size={24} />, label: 'Categories' },
    { path: '/bookings', icon: <Calendar size={24} />, label: 'Bookings' },
    { path: '/account', icon: <User size={24} />, label: 'Account' },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-3 z-50 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs transition-colors ${
              isActive ? 'text-primary font-semibold' : 'text-gray-500 hover:text-primary'
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNavigation;
