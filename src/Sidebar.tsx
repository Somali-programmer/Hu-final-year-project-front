import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ShieldCheck, X, LogOut } from 'lucide-react';
import { cn } from './lib/utils';
import ThemeToggle from './components/ThemeToggle';
import { menuItems } from './config/navigation';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, logout } = useAuth();

  const filteredItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="w-72 bg-brand-surface border-r border-brand-border flex flex-col h-screen sticky top-0 transition-all duration-500">
      <div className="p-5 md:p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-brand-primary/10 transition-all duration-500 border border-brand-border overflow-hidden">
            <img src="https://somali-programmer.github.io/2018_exit_exam-/header-logo.png" alt="HU Logo" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-2xl tracking-tight text-brand-text leading-none transition-colors">HU-AMS</span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-primary mt-1 transition-colors">Haramaya University</span>
          </div>
        </div>
        
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-brand-muted hover:bg-brand-primary/5 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-6 space-y-2 mt-6 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent pb-4">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300",
              isActive 
                ? "bg-brand-primary/10 text-brand-primary shadow-sm" 
                : "text-brand-muted hover:bg-brand-primary/5 hover:text-brand-text"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-brand-primary" : "text-brand-muted/40")} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 md:p-6 border-t border-brand-border">
        <div className="bg-brand-primary/5 rounded-3xl p-5 mb-6 border border-brand-primary/10">
          <div className="flex items-center gap-4 mb-1">
            <div className="w-10 h-10 bg-brand-surface border border-brand-border rounded-2xl flex items-center justify-center text-sm font-bold text-brand-text shadow-sm transition-colors">
              {user?.fullName?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-brand-text truncate transition-colors">{user?.fullName}</p>
              <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest transition-colors">{user?.role}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold text-brand-muted hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
