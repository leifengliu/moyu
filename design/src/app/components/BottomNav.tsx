import { Home, ShoppingBag, Receipt, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/menu', icon: ShoppingBag, label: '点单' },
    { path: '/orders', icon: Receipt, label: '订单' },
    { path: '/profile', icon: User, label: '我的' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DED3] z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 gap-1"
            >
              <Icon 
                className={`w-5 h-5 ${
                  isActive ? 'text-[#C9A961]' : 'text-[#8B8680]'
                }`}
              />
              <span 
                className={`text-xs ${
                  isActive ? 'text-[#C9A961]' : 'text-[#8B8680]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}