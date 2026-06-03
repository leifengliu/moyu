import { ArrowLeft, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/BottomNav';

export default function Support() {
  const navigate = useNavigate();

  const contacts = [
    {
      id: 1,
      icon: Phone,
      title: 'Phone',
      info: '400-888-8888',
      action: 'Call',
    },
    {
      id: 2,
      icon: MessageCircle,
      title: 'WeChat',
      info: '@moyucoffee',
      action: 'Chat',
    },
    {
      id: 3,
      icon: Mail,
      title: 'Email',
      info: 'support@moyu.coffee',
      action: 'Send',
    },
  ];

  const faqs = [
    {
      id: 1,
      question: 'How to use points?',
      answer: 'Points can be redeemed for drinks in the Points section.',
    },
    {
      id: 2,
      question: 'Refund policy?',
      answer: 'Refunds are available within 24 hours of purchase.',
    },
    {
      id: 3,
      question: 'Store hours?',
      answer: 'Open daily from 8:00 AM to 10:00 PM.',
    },
  ];

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-white/10">
        <div className="h-11" />
        <div className="px-6 pb-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-sm text-white tracking-wide uppercase">Support</h1>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="px-6 pt-6 pb-8">
        <h2 className="text-[10px] text-white/40 mb-4 tracking-[0.2em] uppercase">
          Contact Us
        </h2>
        <div className="space-y-3">
          {contacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <div key={contact.id} className="bg-white p-5 border border-black">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-black" />
                    <div>
                      <p className="text-xs text-black tracking-wide">
                        {contact.title}
                      </p>
                      <p className="text-xs text-black/40 mt-0.5">
                        {contact.info}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-black text-white text-[10px] tracking-wide uppercase">
                    {contact.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <div className="px-6 pb-6">
        <h2 className="text-[10px] text-white/40 mb-4 tracking-[0.2em] uppercase">
          FAQ
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-5 border border-black">
              <h3 className="text-xs text-black mb-2 tracking-wide">
                {faq.question}
              </h3>
              <p className="text-xs text-black/40 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="px-6 pb-6">
        <div className="bg-white p-5 border border-black">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-4 h-4 text-black" />
            <h3 className="text-xs text-black tracking-wide uppercase">
              Business Hours
            </h3>
          </div>
          <p className="text-xs text-black/40">Monday - Sunday: 8:00 AM - 10:00 PM</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
