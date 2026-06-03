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
    <div className="min-h-screen bg-[#FAFAF8] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E3DF]">
        <div className="h-11" />
        <div className="flex items-center justify-between px-6 pb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-[#2C2C2C]" />
          </button>
          <div className="w-[103px]" />
        </div>
      </div>

      {/* Product Image */}
      <div className="px-6 pt-4 pb-6 bg-white">
        <div className="aspect-square overflow-hidden bg-[#F5F5F3]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="px-6 py-6 bg-white border-b border-[#E5E3DF]">
        <div className="flex items-baseline justify-between mb-3">
          <h1 className="text-2xl text-[#2C2C2C] tracking-tight">{product.name}</h1>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-[#8B8680]">¥</span>
            <span className="text-2xl text-[#4A3428] font-medium">{product.price}</span>
          </div>
        </div>
        <p className="text-sm text-[#8B8680] leading-relaxed">{product.desc}</p>
      </div>

      {/* Options */}
      <div className="px-6 py-6 space-y-6 bg-[#FAFAF8]">
        {/* Size */}
        <div>
          <h3 className="text-xs text-[#8B8680] mb-3">规格</h3>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-3 text-sm transition-all border ${
                  selectedSize === size
                    ? 'bg-[#4A3428] text-white border-[#4A3428]'
                    : 'bg-white text-[#2C2C2C] border-[#E5E3DF]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div>
          <h3 className="text-xs text-[#8B8680] mb-3">温度</h3>
          <div className="grid grid-cols-4 gap-2">
            {temps.map((temp) => (
              <button
                key={temp}
                onClick={() => setSelectedTemp(temp)}
                className={`py-3 text-sm transition-all border ${
                  selectedTemp === temp
                    ? 'bg-[#4A3428] text-white border-[#4A3428]'
                    : 'bg-white text-[#2C2C2C] border-[#E5E3DF]'
                }`}
              >
                {temp}
              </button>
            ))}
          </div>
        </div>

        {/* Sugar */}
        <div>
          <h3 className="text-xs text-[#8B8680] mb-3">甜度</h3>
          <div className="grid grid-cols-4 gap-2">
            {sugars.map((sugar) => (
              <button
                key={sugar}
                onClick={() => setSelectedSugar(sugar)}
                className={`py-3 text-sm transition-all border ${
                  selectedSugar === sugar
                    ? 'bg-[#4A3428] text-white border-[#4A3428]'
                    : 'bg-white text-[#2C2C2C] border-[#E5E3DF]'
                }`}
              >
                {sugar}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E3DF] px-6 py-5">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="flex items-center gap-3 border border-[#E5E3DF] px-4 py-2 bg-[#F5F5F3]">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-6 h-6 flex items-center justify-center"
            >
              <Minus className="w-4 h-4 text-[#2C2C2C]" />
            </motion.button>
            <span className="text-sm text-[#2C2C2C] w-8 text-center font-medium">{quantity}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(quantity + 1)}
              className="w-6 h-6 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-[#2C2C2C]" />
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-[#4A3428] text-white py-4 text-sm"
          >
            加入购物车 · ¥{product.price * quantity}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
