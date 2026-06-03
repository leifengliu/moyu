import { Home, Coffee, ShoppingBag, Receipt, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/menu', icon: Coffee, label: '点单' },
    { path: '/shop', icon: ShoppingBag, label: '商店' },
    { path: '/orders', icon: Receipt, label: '订单' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E3DF] z-50 safe-area-bottom">
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
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#4A3428]' : 'text-[#A09C97]'
                }`}
              />
              <span
                className={`text-[10px] transition-colors ${
                  isActive ? 'text-[#4A3428]' : 'text-[#A09C97]'
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