import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  temp: string;
  sugar: string;
  image: string;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: '拿铁咖啡',
      price: 28,
      quantity: 2,
      size: '中杯',
      temp: '热饮',
      sugar: '标准糖',
      image: 'https://images.unsplash.com/photo-1622240644058-86d737f0b3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGFydCUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NDU1MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 2,
      name: '美式咖啡',
      price: 22,
      quantity: 1,
      size: '大杯',
      temp: '少冰',
      sugar: '无糖',
      image: 'https://images.unsplash.com/photo-1634568574054-0ab278fdc1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMGNvZmZlZSUyMGN1cCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc0NDQwMDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const orderId = Date.now().toString();
    navigate(`/order/${orderId}`, { 
      state: { 
        items: cartItems, 
        total: totalPrice,
        status: 'pending'
      } 
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8DED3]">
        <div className="h-11" />
        <div className="px-6 pb-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
          </button>
          <h1 className="text-lg text-[#1A1A1A]" style={{ fontFamily: 'serif' }}>购物车</h1>
          <span className="ml-auto text-sm text-[#8B8680]">{totalItems} 件</span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 border border-[#E8DED3]">
            <span className="text-4xl">🛒</span>
          </div>
          <p className="text-sm text-[#8B8680] mb-8">购物车空空如也</p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/menu')}
            className="px-8 py-3 bg-[#1A1614] text-[#C9A961] rounded-lg text-sm"
          >
            去点单
          </motion.button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="px-6 py-6 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-lg p-5 border border-[#E8DED3]"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[#F8F6F3]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-base text-[#1A1A1A] mb-2">{item.name}</h3>
                          <p className="text-xs text-[#8B8680]">
                            {item.size} / {item.temp} / {item.sugar}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 -mt-2 -mr-2"
                        >
                          <Trash2 className="w-4 h-4 text-[#8B8680]" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-[#8B8680]">¥</span>
                          <span className="text-lg text-[#C9A961]">{item.price}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#F8F6F3] rounded-lg px-3 py-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4 text-[#8B8680]" />
                          </motion.button>
                          <span className="text-sm text-[#1A1A1A] w-6 text-center font-medium">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-[#8B8680]" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Coupon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-5 flex items-center justify-between border border-[#E8DED3]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F8F6F3] rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎫</span>
                </div>
                <div>
                  <p className="text-sm text-[#1A1A1A]">优惠券</p>
                  <p className="text-xs text-[#C9A961]">3 张可用</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#CCCCCC]" />
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DED3] px-6 py-5">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#8B8680]">合计</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-[#8B8680]">¥</span>
                  <span className="text-3xl text-[#C9A961] font-medium">{totalPrice}</span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-[#1A1614] text-[#C9A961] rounded-lg py-4 text-base"
              >
                去结算
              </motion.button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
