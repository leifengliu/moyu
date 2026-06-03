import { ArrowLeft, Camera, ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';

export default function UserInfo() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('摸鱼用户');
  const [phone, setPhone] = useState('138****8888');
  const [birthday, setBirthday] = useState('1990-01-01');
  const [gender, setGender] = useState('male');

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E3DF]">
        <div className="h-11" />
        <div className="px-6 pb-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-[#2C2C2C]" />
          </button>
          <button className="text-sm text-[#4A3428] px-3 py-1.5 font-medium">保存</button>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="px-6 pt-8 pb-8 bg-white">
        <div className="flex flex-col items-center">
          <button className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-[#4A3428] to-[#6B4F3E] flex items-center justify-center shadow-md">
              <span className="text-white text-3xl">摸</span>
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#C9A67A] flex items-center justify-center shadow-md">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </button>
          <p className="text-xs text-[#8B8680] mt-4">点击更换头像</p>
        </div>
      </div>

      {/* Form */}
      <div className="mt-3">
        {/* Nickname */}
        <div className="bg-white px-6 py-5 border-y border-[#E5E3DF]">
          <label className="block text-xs text-[#8B8680] mb-3">昵称</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full text-base text-[#2C2C2C] outline-none bg-[#F5F5F3] px-4 py-3 border border-[#E5E3DF]"
            placeholder="请输入昵称"
          />
        </div>

        {/* Phone */}
        <div className="bg-white px-6 py-5 border-b border-[#E5E3DF]">
          <label className="block text-xs text-[#8B8680] mb-3">手机号</label>
          <div className="flex items-center justify-between bg-[#F5F5F3] px-4 py-3 border border-[#E5E3DF]">
            <span className="text-base text-[#2C2C2C]">{phone}</span>
            <div className="flex items-center gap-2 text-[#4A3428]">
              <span className="text-xs">更换</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Gender */}
        <div className="bg-white px-6 py-5 border-b border-[#E5E3DF]">
          <label className="block text-xs text-[#8B8680] mb-3">性别</label>
          <div className="flex gap-3">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-3 text-sm transition-all ${
                gender === 'male'
                  ? 'bg-[#4A3428] text-white'
                  : 'bg-[#F5F5F3] text-[#8B8680] border border-[#E5E3DF]'
              }`}
            >
              男
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-3 text-sm transition-all ${
                gender === 'female'
                  ? 'bg-[#4A3428] text-white'
                  : 'bg-[#F5F5F3] text-[#8B8680] border border-[#E5E3DF]'
              }`}
            >
              女
            </button>
          </div>
        </div>

        {/* Birthday */}
        <div className="bg-white px-6 py-5 border-b border-[#E5E3DF]">
          <label className="block text-xs text-[#8B8680] mb-3">生日</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full text-base text-[#2C2C2C] outline-none bg-[#F5F5F3] px-4 py-3 border border-[#E5E3DF]"
          />
        </div>
      </div>

      {/* Account Info */}
      <div className="px-6 pt-6">
        <div className="bg-gradient-to-br from-[#F5F5F3] to-white p-6 border border-[#E5E3DF]">
          <div className="flex items-center gap-3 mb-3">
            <User className="w-5 h-5 text-[#4A3428]" />
            <h3 className="text-sm text-[#2C2C2C] font-medium">账户信息</h3>
          </div>
          <div className="space-y-2 text-xs text-[#8B8680]">
            <p>注册时间：2026年3月1日</p>
            <p>最后登录：2026年6月3日</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-6 pt-6 pb-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/login')}
          className="w-full bg-white border border-[#E74C3C] text-[#E74C3C] py-4 text-sm font-medium hover:bg-[#E74C3C] hover:text-white transition-colors"
        >
          退出登录
        </motion.button>
      </div>
    </div>
  );
}
