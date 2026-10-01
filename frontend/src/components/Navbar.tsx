import React, { useState } from 'react';
import { Sprout, Menu, X, ShieldCheck, Cpu, Database, Info, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sprout },
    { id: 'detect', label: 'Detect Disease', icon: ShieldCheck },
    { id: 'dataset', label: 'Dataset', icon: Database },
    { id: 'model', label: 'Model', icon: Cpu },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DDE8DF]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group cursor-pointer min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D] shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-[#17201A]">CropDetect</span>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#15803D]">AI</span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]/60 ml-0.5">
                  CNN v1.0
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium truncate hidden sm:block">
                Intelligent Crop Disease Detection
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#F0FDF4] text-[#15803D] font-semibold border border-[#BBF7D0]'
                      : 'text-gray-600 hover:text-[#17201A] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#15803D]' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('detect')}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-lg text-sm font-semibold bg-[#15803D] text-white hover:bg-[#166534] shadow-sm hover:shadow-md transition-all duration-150 active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              Try Detection
            </button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-gray-700 hover:text-[#15803D] hover:bg-[#F0FDF4] border border-[#DDE8DF] focus:outline-hidden focus:ring-2 focus:ring-[#15803D] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DDE8DF] bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-lg animate-fadeIn max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#F0FDF4] text-[#15803D] font-bold border border-[#BBF7D0]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#15803D]' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('detect')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-[#15803D] text-white hover:bg-[#166534] shadow-sm transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              Try Detection
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
