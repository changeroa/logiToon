
import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, BookOpen, Mic, MicOff } from "lucide-react";
import { GenerationConfig } from "../types";

interface HeroInputProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

export const HeroInput: React.FC<HeroInputProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup recognition on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR'; 
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSearch(input.trim());
    }
  };

  const handleSuggestion = (topic: string) => {
    setInput(topic);
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center py-8 px-4">
      <div className="mb-6 flex justify-center">
        <div className="bg-white p-3 rounded-full shadow-lg animate-bounce-slow">
          <BookOpen className="w-10 h-10 text-amber-500" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
        LogiToon <span className="text-amber-500">Magic</span>
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto break-keep">
        Got a question? Type it below or tap the mic to speak!
      </p>

      <form onSubmit={handleSubmit} className="relative w-full mx-auto mb-6">
        <div className="relative z-20 group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Why is the sky blue?"
            className="w-full p-6 pl-8 pr-48 rounded-full border-4 border-amber-200 focus:border-amber-400 focus:outline-none shadow-xl text-lg text-slate-700 placeholder-slate-400 transition-all group-hover:shadow-2xl"
            disabled={isLoading}
          />
          
          <div className="absolute right-3 top-3 bottom-3 flex gap-2">
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-200 shadow-lg' 
                  : 'bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50'
              }`}
              title="Speak your question"
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:shadow-none disabled:scale-100"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <ArrowRight size={24} />
              )}
            </button>
          </div>
        </div>
        {isListening && (
           <div className="absolute -bottom-8 left-0 w-full text-center text-rose-500 text-sm font-bold animate-pulse">
             Listening... Speak now!
           </div>
        )}
      </form>

      {/* Suggested Topics */}
      <div className="flex flex-wrap justify-center gap-3">
        {["How do airplanes fly?", "Why do we get cavities?", "How are rainbows made?"].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestion(suggestion)}
            className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-slate-500 hover:text-amber-600 hover:shadow-md transition-all border border-slate-100"
          >
            <Sparkles size={14} className="inline mr-1" />
            {suggestion}
          </button>
        ))}
      </div>
      
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
