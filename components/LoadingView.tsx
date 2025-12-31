import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingViewProps {
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ message = "The director is writing the script..." }) => {
  return (
    <div className="w-full py-20 text-center flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        </div>
        <div className="absolute -top-2 -right-2 bg-sky-400 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
            Thinking!
        </div>
      </div>
      <h3 className="mt-8 text-xl font-bold text-slate-700">{message}</h3>
      <p className="text-slate-500 mt-2">Please wait a moment!</p>
    </div>
  );
};
