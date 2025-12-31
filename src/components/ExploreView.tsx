import React from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

interface ExploreViewProps {
  onSelectTopic: (topic: string) => void;
}

const FEATURED_TOPICS = [
  {
    id: 1,
    title: "What is a Black Hole?",
    subtitle: "Space",
    topic: "What is inside a black hole?",
    image: "https://images.unsplash.com/photo-1516339901601-2e1b5cebf0f3?auto=format&fit=crop&w=600&q=80",
    color: "from-purple-900 to-indigo-900"
  },
  {
    id: 2,
    title: "Why do Volcanoes Erupt?",
    subtitle: "Earth",
    topic: "Why do volcanoes erupt?",
    image: "https://images.unsplash.com/photo-1562512684-0a696c340890?auto=format&fit=crop&w=600&q=80",
    color: "from-orange-700 to-red-900"
  },
  {
    id: 3,
    title: "What lives in the Deep Sea?",
    subtitle: "Ocean",
    topic: "What lives at the bottom of the ocean?",
    image: "https://images.unsplash.com/photo-1559530438-d696d539618f?auto=format&fit=crop&w=600&q=80", 
    color: "from-blue-800 to-cyan-900"
  },
  {
    id: 4,
    title: "Why do we Dream?",
    subtitle: "Brain",
    topic: "Why do we dream?",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80",
    color: "from-pink-600 to-rose-900"
  },
  {
    id: 5,
    title: "How does the Internet work?",
    subtitle: "Tech",
    topic: "How does the internet work?",
    image: "https://images.unsplash.com/photo-1485827404421-7fac01171897?auto=format&fit=crop&w=600&q=80",
    color: "from-emerald-600 to-teal-900"
  },
  {
    id: 6,
    title: "What is Electricity?",
    subtitle: "Science",
    topic: "What is electricity?",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80",
    color: "from-amber-500 to-yellow-800"
  }
];

export const ExploreView: React.FC<ExploreViewProps> = ({ onSelectTopic }) => {
  return (
    <div className="w-full pb-20">
      <div className="mb-8 pl-2 flex items-center gap-3 border-b border-slate-200 pb-4">
         <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
             <Compass size={24} />
         </div>
         <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Explore</h2>
            <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wide">Discover Wonders</p>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {FEATURED_TOPICS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTopic(item.topic)}
            className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-md group transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 border border-white/20 bg-slate-200"
          >
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${item.color}`} />

            {/* Background Image */}
            <img 
                src={item.image} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-overlay opacity-90"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
            />
            
            {/* Dark Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-5 text-left flex flex-col justify-end h-full">
                
                <div className="mb-auto self-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <ArrowRight size={20} className="text-white" />
                    </div>
                </div>

                <div>
                    <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white mb-2 uppercase tracking-wider border border-white/10">
                        {item.subtitle}
                    </span>
                    <h3 className="text-xl font-black text-white leading-tight drop-shadow-lg pr-2 mt-1">
                        {item.title}
                    </h3>
                </div>
            </div>
            
            <div className="absolute top-4 right-4 opacity-70">
                 <Sparkles className="text-yellow-300 w-5 h-5 animate-pulse" />
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-slate-400 text-sm font-medium">More curious topics coming soon!</p>
      </div>
    </div>
  );
};
