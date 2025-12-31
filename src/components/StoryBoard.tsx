
import React, { useEffect, useState, useRef } from "react";
import { StoryResponse, Panel, EducationalContent } from "../types";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, MessageCircle, RotateCcw, PlayCircle, BookOpen } from "lucide-react";

interface StoryBoardProps {
  story: StoryResponse;
  onClose: () => void;
}

// --- TTS HELPER ---
const useTTS = (text: string, isAutoPlay: boolean, langCode: string = 'en') => {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // 1. Load Voices properly (handling async browser behavior)
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // 2. Handle Text Change & AutoPlay
  useEffect(() => {
    window.speechSynthesis.cancel(); 
    if (isAutoPlay && text) {
        // Small timeout to ensure voices are ready or previous speech is fully cancelled
        const timer = setTimeout(() => speak(), 600); // Increased delay slightly for page flip animation
        return () => clearTimeout(timer);
    }
    return () => {
        window.speechSynthesis.cancel();
    };
  }, [text, langCode, isAutoPlay, voices]);

  const speak = () => {
    if (!text || voices.length === 0) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 3. Robust Language Matching
    // Normalize input (e.g., 'ko' -> 'ko-KR', 'en' -> 'en-US')
    let targetLang = langCode.toLowerCase();
    if (targetLang === 'ko') targetLang = 'ko-kr';
    if (targetLang === 'en') targetLang = 'en-us';
    if (targetLang === 'ja') targetLang = 'ja-jp';

    utterance.lang = targetLang;
    utterance.rate = 0.9; 
    utterance.pitch = 1.05;

    // Find the best voice
    const bestVoice = 
      // Priority 1: Exact match with "Google" (usually higher quality)
      voices.find(v => v.lang.toLowerCase() === targetLang && v.name.includes("Google")) ||
      // Priority 2: Exact language match
      voices.find(v => v.lang.toLowerCase() === targetLang) ||
      // Priority 3: Prefix match (e.g. 'en' matches 'en-US')
      voices.find(v => v.lang.toLowerCase().startsWith(targetLang.split('-')[0]));

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return { speaking, speak, stop };
};

// --- PAGES ---

// 1. Cover Page
const CoverPage: React.FC<{ story: StoryResponse; onStart: () => void }> = ({ story, onStart }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-[#fdfbf7] p-8 relative overflow-hidden shadow-2xl">
    {/* Book Texture Effect */}
    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />
    <div className="absolute inset-4 border-2 border-[#e3d5b8] pointer-events-none z-10 rounded-3xl" />
    
    <div className="max-w-3xl w-full flex flex-col items-center z-20 text-center animate-fade-in">
      <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-8 border-4 border-amber-200 shadow-inner">
        <BookOpen className="w-16 h-16 text-amber-600" />
      </div>
      
      <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 text-slate-800 tracking-tight leading-tight drop-shadow-sm break-keep">
        {story.title}
      </h1>
      
      <div className="w-24 h-1.5 bg-amber-500 mb-8 rounded-full" />
      
      <p className="text-xl md:text-2xl text-slate-600 mb-12 font-medium max-w-lg leading-relaxed font-serif italic break-keep">
        {story.topic_summary}
      </p>
      
      <button 
        onClick={onStart}
        className="px-12 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3"
      >
        <PlayCircle size={28} className="text-amber-400" />
        Open Book
      </button>
    </div>
  </div>
);

// 2. Story Page (Immersive Layout)
const StoryPage: React.FC<{ panel: Panel; total: number; isAutoPlay: boolean; lang?: string }> = ({ panel, total, isAutoPlay, lang }) => {
  const imageUrl = panel.imageUrl || `https://picsum.photos/seed/${panel.panel_id + 500}/800/800`;
  const { speaking, speak, stop } = useTTS(panel.narrative, isAutoPlay, lang);

  // Split narrative into sentences
  const sentences = panel.narrative.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [panel.narrative];

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#fdfbf7] relative shadow-lg">
       
       {/* Left: Full Bleed Image with Blurred Background */}
       <div className="w-full md:w-1/2 h-[50vh] md:h-full relative overflow-hidden bg-slate-900 border-r border-[#e3d5b8]">
          {/* Blurred Background (fills letterbox areas) */}
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
          />
          {/* Main Image (always fully visible) */}
          <img
            src={imageUrl}
            alt={`Page ${panel.panel_id}`}
            className="relative w-full h-full object-contain animate-fade-in z-10"
          />
          {/* Subtle vignette/texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none mix-blend-multiply" />
          
          {/* Mobile Only Page Number */}
          <div className="absolute bottom-4 right-4 md:hidden bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
             {panel.panel_id}
          </div>
       </div>

       {/* Right: Classic Storybook Text */}
       <div className="w-full md:w-1/2 h-[50vh] md:h-full relative flex flex-col">
          {/* Paper Texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />

          <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 overflow-y-auto">
             
             {/* Speaker Tag (Subtle) */}
             {panel.speaker && (
                <div className="mb-6 self-start">
                   <span className="text-amber-600 font-bold uppercase tracking-widest text-xs border-b-2 border-amber-200 pb-1">
                     {panel.speaker}
                   </span>
                </div>
             )}

             {/* Narrative Text - Sentence by Sentence */}
             <div className="w-full font-serif text-slate-800 text-xl md:text-3xl leading-loose md:leading-[2.2]">
                {sentences.map((sentence, idx) => (
                  <p key={idx} className="mb-8 last:mb-0 break-keep">
                    {sentence.trim()}
                  </p>
                ))}
             </div>
          </div>

          {/* Footer Controls */}
          <div className="p-6 md:p-10 flex justify-between items-end border-t border-slate-100/50 bg-white/30 backdrop-blur-sm">
             <div className="text-slate-300 font-serif italic text-lg hidden md:block">
               Page {panel.panel_id}
             </div>

             <button 
                onClick={speaking ? stop : speak}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all shadow-sm ${
                    speaking 
                    ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200" 
                    : "bg-white text-slate-500 hover:text-amber-600 hover:ring-2 hover:ring-amber-100"
                }`}
              >
                {speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                <span className="font-bold text-sm uppercase tracking-wide">{speaking ? "Pause" : "Listen"}</span>
              </button>
          </div>
       </div>

       {/* Center Gutter Shadow (Book Fold) */}
       <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-full md:w-16 md:-ml-8 bg-gradient-to-r from-transparent via-black/5 to-transparent pointer-events-none hidden md:block z-20" />
    </div>
  );
};

// 3. End Page
const EndPage: React.FC<{ 
  content: EducationalContent; 
  onRestart: () => void;
  isAutoPlay: boolean;
  lang?: string;
}> = ({ content, onRestart, isAutoPlay, lang }) => {
  const { speaking, speak, stop } = useTTS(content.summary, isAutoPlay, lang);

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#fdfbf7] relative shadow-2xl">
       <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />

       {/* Left: Summary */}
       <div className="w-full md:w-1/2 h-full p-12 md:p-24 flex flex-col justify-center items-start border-r border-[#e3d5b8] bg-[#fffcf5] relative z-10">
          <div className="bg-amber-100 p-4 rounded-full mb-8 inline-block">
             <Sparkles size={32} className="text-amber-600" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-black text-slate-800 mb-8 break-keep">The End.</h2>
          
          <div className="prose prose-xl prose-slate font-serif leading-relaxed">
             <p className="text-slate-600 break-keep">{content.summary}</p>
          </div>

          <div className="mt-12">
             <button 
                onClick={speaking ? stop : speak}
                className="flex items-center gap-3 text-slate-500 font-bold hover:text-amber-600 transition-colors"
             >
                <div className={`p-2 rounded-full ${speaking ? 'bg-amber-100 text-amber-600' : 'bg-slate-200'}`}>
                    {speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </div>
                {speaking ? "Stop Reading" : "Read Summary"}
             </button>
          </div>
       </div>

       {/* Right: Action */}
       <div className="w-full md:w-1/2 h-full p-12 flex flex-col items-center justify-center relative z-10">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-400 mb-8 uppercase tracking-widest">Adventure Complete</h3>
            
            <button 
              onClick={onRestart}
              className="group px-10 py-5 bg-white border-2 border-slate-200 hover:border-slate-800 rounded-2xl font-bold text-xl text-slate-500 hover:text-slate-800 transition-all flex items-center gap-3 shadow-sm hover:shadow-xl"
            >
              <RotateCcw size={24} className="group-hover:-rotate-180 transition-transform duration-700 ease-in-out" />
              Read Again
            </button>
          </div>
       </div>
    </div>
  );
};

// --- MAIN READER LAYOUT ---

export const StoryBoard: React.FC<StoryBoardProps> = ({ story, onClose }) => {
  const [pageIndex, setPageIndex] = useState<number>(-1); // -1: Cover
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [autoTTS, setAutoTTS] = useState(true);

  const totalPages = story.panels.length;

  const nextPage = () => {
    if (pageIndex < totalPages) {
      setDirection('next');
      setPageIndex(p => p + 1);
    }
  };

  const prevPage = () => {
    if (pageIndex > -1) {
      setDirection('prev');
      setPageIndex(p => p - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pageIndex]);

  return (
    <div className="w-full h-full bg-slate-200 flex flex-col relative overflow-hidden perspective-2000">
      
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full h-20 flex items-center justify-between px-6 z-50 pointer-events-none">
         <button onClick={onClose} className="pointer-events-auto flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-slate-500 hover:text-red-500 font-bold transition-all shadow-sm hover:shadow-md border border-slate-100">
            <ChevronLeft size={18} /> <span className="hidden md:inline">Library</span>
         </button>
         
         <div className="pointer-events-auto">
             <button 
               onClick={() => setAutoTTS(!autoTTS)}
               className={`text-xs font-bold px-4 py-2 rounded-full border shadow-sm transition-all ${autoTTS ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/80 backdrop-blur-md text-slate-400 border-slate-200'}`}
             >
               Auto-Read: {autoTTS ? "ON" : "OFF"}
             </button>
         </div>
      </div>

      {/* Book Content - Animate Key Change */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-10">
        <div 
          key={pageIndex}
          className={`w-full h-full max-w-7xl aspect-[16/10] bg-white rounded-l-md rounded-r-md shadow-2xl overflow-hidden origin-left ${direction === 'next' ? 'animate-turn-next' : 'animate-turn-prev'}`}
        >
          {pageIndex === -1 && <CoverPage story={story} onStart={nextPage} />}
          
          {pageIndex >= 0 && pageIndex < totalPages && (
            <StoryPage 
                panel={story.panels[pageIndex]} 
                total={totalPages} 
                isAutoPlay={autoTTS}
                lang={story.language}
            />
          )}
          
          {pageIndex === totalPages && (
            <EndPage 
                content={story.educational_content} 
                onRestart={() => {
                  setDirection('prev');
                  setPageIndex(-1);
                }}
                isAutoPlay={autoTTS}
                lang={story.language}
              />
          )}
        </div>
      </div>

      {/* Navigation Arrows (Floating) */}
      {pageIndex >= 0 && (
        <>
           <button 
             onClick={prevPage}
             disabled={pageIndex === -1}
             className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-800 shadow-lg hover:scale-110 transition-all z-40 disabled:opacity-0"
           >
             <ChevronLeft size={28} />
           </button>

           <button 
             onClick={pageIndex === totalPages ? onClose : nextPage}
             className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-white shadow-lg hover:scale-110 transition-all z-40 hover:bg-slate-700"
           >
              <ChevronRight size={28} />
           </button>
        </>
      )}
    </div>
  );
};
