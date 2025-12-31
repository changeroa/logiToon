import React from "react";
import { PlusCircle, Library, Compass } from "lucide-react";

interface BottomNavProps {
  activeTab: 'home' | 'explore' | 'library';
  onTabChange: (tab: 'home' | 'explore' | 'library') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-20 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex items-center justify-around px-2 pb-2 z-40 shadow-lg">
      
      {/* Create / Home */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${
          activeTab === 'home' 
            ? 'text-amber-500 scale-105' 
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
        }`}
      >
        <PlusCircle size={26} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Create</span>
      </button>

      {/* Explore */}
      <button
        onClick={() => onTabChange('explore')}
        className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${
          activeTab === 'explore' 
            ? 'text-indigo-500 scale-105' 
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
        }`}
      >
        <Compass size={26} strokeWidth={activeTab === 'explore' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Explore</span>
      </button>

      {/* Library */}
      <button
        onClick={() => onTabChange('library')}
        className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${
          activeTab === 'library' 
            ? 'text-amber-500 scale-105' 
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
        }`}
      >
        <Library size={26} strokeWidth={activeTab === 'library' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Library</span>
      </button>
    </div>
  );
};
