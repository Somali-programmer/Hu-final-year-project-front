import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from './types';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './lib/utils';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const handleLogin = async () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-cream p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-premium-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-premium-black/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-white rounded-[32px] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.08)] p-4 md:p-6 md:p-12 text-center border border-gray-100 relative z-10"
      >
        <div className="mb-8 md:mb-12">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-premium-black rounded-[32px] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl shadow-premium-black/30 transform hover:rotate-6 transition-transform duration-500">
            <ShieldCheck className="text-white w-10 h-10 md:w-12 md:h-12" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-black mb-3 md:mb-4 tracking-tight">
            HU <span className="text-gray-black/40 italic">Attendance</span>
          </h1>
          <p className="text-gray-black/60 font-medium uppercase tracking-[0.3em] text-[10px] md:text-xs">Haramaya University • Premium Edition</p>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <label className="premium-label text-center">Select Your Portal</label>
            <div className="grid grid-cols-2 gap-3">
              {(['student', 'instructor', 'admin', 'qa'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border",
                    selectedRole === role 
                      ? "bg-premium-black text-white border-premium-black shadow-xl shadow-premium-black/10" 
                      : "bg-premium-cream/30 text-gray-black/40 border-transparent hover:border-premium-black/30 hover:text-black"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
            Experience the next generation of academic management. Secure, seamless, and sophisticated.
          </p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="premium-button w-full flex items-center justify-center gap-4 group"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="uppercase tracking-[0.2em] text-sm">Enter Dashboard</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.div>
              </>
            )}
          </button>

          <div className="pt-8 border-t border-gray-50">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
              Authorized Personnel Only • &copy; 2026
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
