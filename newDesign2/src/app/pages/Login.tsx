import { Coffee } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  const handleLogin = () => {
    if (phone && code && agreed) {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F8F6F3] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-16"
        >
          <div className="w-24 h-24 bg-[#1A1614] rounded-lg flex items-center justify-center mb-6">
            <Coffee className="w-12 h-12 text-[#C9A961]" />
          </div>
          <h1 className="text-3xl text-[#1A1A1A] text-center tracking-wider" style={{ fontFamily: 'serif' }}>摸鱼咖啡</h1>
          <p className="text-sm text-[#8B8680] text-center mt-3 tracking-widest">MOYU COFFEE</p>
        </motion.div>
        
        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm space-y-4"
        >
          {/* Phone Input */}
          <div className="bg-white rounded-lg px-6 py-4 border border-[#E8DED3]">
            <input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent outline-none text-[#1A1A1A] placeholder:text-[#8B8680]"
              maxLength={11}
            />
          </div>
          
          {/* Code Input */}
          <div className="bg-white rounded-lg px-6 py-4 flex items-center gap-4 border border-[#E8DED3]">
            <input
              type="text"
              placeholder="请输入验证码"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#1A1A1A] placeholder:text-[#8B8680]"
              maxLength={6}
            />
            <button className="text-sm text-[#C9A961] whitespace-nowrap">
              获取验证码
            </button>
          </div>
          
          {/* Agreement */}
          <div className="flex items-start gap-2 px-2">
            <button
              onClick={() => setAgreed(!agreed)}
              className="mt-0.5"
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                agreed ? 'bg-[#1A1614] border-[#1A1614]' : 'border-[#CCCCCC]'
              }`}>
                {agreed && (
                  <svg className="w-3 h-3 text-[#C9A961]" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </button>
            <p className="text-xs text-[#8B8680] leading-relaxed">
              我已阅读并同意
              <span className="text-[#C9A961]">《用户协议》</span>
              和
              <span className="text-[#C9A961]">《隐私政策》</span>
            </p>
          </div>
          
          {/* Login Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={!phone || !code || !agreed}
            className={`w-full py-4 rounded-lg text-base transition-all ${
              phone && code && agreed
                ? 'bg-[#1A1614] text-[#C9A961]'
                : 'bg-[#E8DED3] text-[#8B8680]'
            }`}
          >
            登录
          </motion.button>
          
          {/* WeChat Login */}
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DED3]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#F8F6F3] text-xs text-[#8B8680]">其他登录方式</span>
            </div>
          </div>
          
          <button className="w-full py-4 rounded-lg border border-[#E8DED3] text-[#8B8680] text-base flex items-center justify-center gap-2 bg-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.87c-.135-.01-.27-.012-.406-.012zm-2.53 3.274c.535 0 .969.44.969.98 0 .538-.434.98-.969.98a.976.976 0 0 1-.969-.98c0-.54.434-.98.969-.98zm4.844 0c.535 0 .969.44.969.98 0 .538-.434.98-.969.98a.976.976 0 0 1-.969-.98c0-.54.434-.98.969-.98z"/>
            </svg>
            微信一键登录
          </button>
        </motion.div>
      </div>
    </div>
  );
}
