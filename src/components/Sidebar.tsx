import React from "react";
import { PlusCircle, Library, Compass, BookOpen } from "lucide-react";
import { Tab } from "../App";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'home', label: 'Create Story', icon: PlusCircle, color: 'text-amber-500' },
    { id: 'explore', label: 'Explore', icon: Compass, color: 'text-indigo-500' },
    { id: 'library', label: 'My Library', icon: Library, color: 'text-emerald-500' },
  ] as const;

  return (
    <div className="w-20 md:w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col items-center md:items-start py-8 z-40 transition-all duration-300">
      
      {/* Logo Area */}
      <div className="px-0 md:px-6 mb-12 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
          <BookOpen className="text-white w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div className="hidden md:block">
          <h1 className="font-extrabold text-xl text-slate-800 tracking-tight">LogiToon</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Director</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 w-full px-2 md:px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-3 py-3 md:px-4 md:py-4 rounded-xl transition-all group ${
              activeTab === item.id
                ? 'bg-slate-100 shadow-sm'
                : 'hover:bg-slate-50'
            }`}
          >
            <item.icon 
              size={24} 
              className={`transition-transform duration-300 group-hover:scale-110 ${activeTab === item.id ? item.color : 'text-slate-400'}`} 
              strokeWidth={activeTab === item.id ? 2.5 : 2}
            />
            <span className={`hidden md:block font-bold text-sm ${activeTab === item.id ? 'text-slate-800' : 'text-slate-500'}`}>
              {item.label}
            </span>
            
            {activeTab === item.id && (
              <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-slate-800" />
            )}
          </button>
        ))}
      </nav>

      {/* User / Settings Placeholder (Bottom) */}
      <div className="mt-auto px-4 w-full hidden md:block">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
           <p className="text-xs font-semibold text-slate-500 text-center">
             "Creativity is intelligence having fun."
           </p>
        </div>
      </div>
    </div>
  );
};
