import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Book, Layers, BookOpen, FileText, ArrowLeft, Menu, X } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import Footer from '../../components/Footer';
import { useAuth } from '../../AuthContext';

const DocsLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user } = useAuth();

  const navItems = [
    { name: 'System Documentation', path: '/docs/system', icon: Book },
    { name: 'System Architecture', path: '/docs/architecture', icon: Layers },
    { name: 'User Manual', path: '/docs/manual', icon: BookOpen },
    { name: 'Final Year Project', path: '/docs/proposal', icon: FileText },
  ];

  const backLink = user ? '/dashboard' : '/';
  const backText = user ? 'Back to Dashboard' : 'Back to Home';

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col transition-colors duration-500">
      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Toggle & Header overlay */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-brand-surface border-b border-brand-primary/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-brand-text p-1 rounded-md bg-brand-bg border border-brand-primary/20"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to={backLink} className="text-brand-muted hover:text-brand-primary" title={backText}>
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </div>
          <span className="font-serif font-bold text-brand-primary truncate max-w-[120px] text-center">Docs</span>
          <ThemeToggle />
        </div>

        {/* Sidebar */}
        <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-brand-surface border-r border-brand-primary/10 flex flex-col z-30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0 mt-[60px] md:mt-0 h-[calc(100vh-60px)] md:h-screen' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 hidden md:block">
            <Link to={backLink} className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-primary transition-colors font-medium mb-6">
              <ArrowLeft className="w-5 h-5" />
              {backText}
            </Link>
            <h2 className="text-xl font-serif font-bold tracking-tight text-brand-primary">HU-AMS Docs</h2>
          </div>
          <nav className="flex-1 px-4 py-4 md:py-0 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'text-brand-text hover:bg-brand-primary/5 hover:text-brand-primary'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          {/* Mobile Back Link in Sidebar */}
          <div className="p-4 md:hidden border-t border-brand-primary/10">
            <Link to={backLink} className="flex items-center gap-2 text-brand-muted hover:text-brand-primary transition-colors font-medium">
              <ArrowLeft className="w-5 h-5" />
              {backText}
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-brand-bg flex flex-col pt-[60px] md:pt-0 overflow-x-hidden">
          <div className="hidden md:flex justify-end p-6 border-b border-brand-primary/10 bg-brand-surface sticky top-0 z-20">
             <ThemeToggle />
          </div>
          <div className="flex-1 p-6 md:p-12">
            <Outlet />
          </div>
          <div className="mt-auto border-t border-brand-primary/10">
            <Footer />
          </div>
        </main>
        
        {/* Mobile backdrop */}
        {isSidebarOpen && (
           <div 
             className="md:hidden fixed inset-0 bg-black/50 z-20 pt-[60px]" 
             onClick={() => setIsSidebarOpen(false)} 
           />
        )}
      </div>
    </div>
  );
};

export default DocsLayout;
