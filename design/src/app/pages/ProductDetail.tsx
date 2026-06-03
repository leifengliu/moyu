import { ArrowLeft, Share2, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('中杯');
  const [selectedTemp, setSelectedTemp] = useState('热饮');
  const [selectedSugar, setSelectedSugar] = useState('标准糖');
  
  const product = {
    id: 1,
    name: '拿铁咖啡',
    price: 28,
    image: 'https://images.unsplash.com/photo-1622240644058-86d737f0b3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGFydCUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NDU1MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    desc: '经典浓郁的拿铁咖啡，选用优质咖啡豆，搭配香醇牛奶，口感丝滑细腻。',
  };
  
  const sizes = ['小杯', '中杯', '大杯'];
  const temps = ['热饮', '少冰', '正常冰', '多冰'];
  const sugars = ['无糖', '三分糖', '五分糖', '标准糖'];
  
  return (
    <div className="min-h-screen bg-[#F8F6F3] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md">
        <div className="h-11" />
        <div className="flex items-center justify-between px-6 pb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
          </button>
          <button className="p-2 -mr-2">
            <Share2 className="w-6 h-6 text-[#1A1A1A]" />
          </button>
        </div>
      </div>
      
      {/* Product Image */}
      <div className="px-6 pb-8">
        <div className="aspect-square rounded-lg overflow-hidden bg-white border border-[#E8DED3]">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Product Info */}
      <div className="px-6 pb-8">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-2xl text-[#1A1A1A]" style={{ fontFamily: 'serif' }}>{product.name}</h1>
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-[#8B8680]">¥</span>
            <span className="text-2xl text-[#C9A961]">{product.price}</span>
          </div>
        </div>
        <p className="text-sm text-[#8B8680] leading-relaxed">{product.desc}</p>
      </div>
      
      {/* Options */}
      <div className="px-6 space-y-8">
        {/* Size */}
        <div>
          <h3 className="text-sm text-[#1A1A1A] mb-4 tracking-wider">规格 SIZE</h3>
          <div className="flex gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-3 rounded-lg text-sm transition-all border ${
                  selectedSize === size 
                    ? 'bg-[#1A1614] text-[#C9A961] border-[#1A1614]' 
                    : 'bg-white text-[#8B8680] border-[#E8DED3]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        {/* Temperature */}
        <div>
          <h3 className="text-sm text-[#1A1A1A] mb-4 tracking-wider">温度 TEMPERATURE</h3>
          <div className="grid grid-cols-4 gap-3">
            {temps.map((temp) => (
              <button
                key={temp}
                onClick={() => setSelectedTemp(temp)}
                className={`py-3 rounded-lg text-sm transition-all border ${
                  selectedTemp === temp 
                    ? 'bg-[#1A1614] text-[#C9A961] border-[#1A1614]' 
                    : 'bg-white text-[#8B8680] border-[#E8DED3]'
                }`}
              >
                {temp}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sugar */}
        <div>
          <h3 className="text-sm text-[#1A1A1A] mb-4 tracking-wider">甜度 SWEETNESS</h3>
          <div className="grid grid-cols-4 gap-3">
            {sugars.map((sugar) => (
              <button
                key={sugar}
                onClick={() => setSelectedSugar(sugar)}
                className={`py-3 rounded-lg text-sm transition-all border ${
                  selectedSugar === sugar 
                    ? 'bg-[#1A1614] text-[#C9A961] border-[#1A1614]' 
                    : 'bg-white text-[#8B8680] border-[#E8DED3]'
                }`}
              >
                {sugar}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DED3] px-6 py-5">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#F8F6F3] rounded-lg px-4 py-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center"
            >
              <Minus className="w-4 h-4 text-[#8B8680]" />
            </motion.button>
            <span className="text-base text-[#1A1A1A] w-8 text-center font-medium">{quantity}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-[#8B8680]" />
            </motion.button>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-[#1A1614] text-[#C9A961] rounded-lg py-4 text-base"
          >
            加入购物车 · ¥{product.price * quantity}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
