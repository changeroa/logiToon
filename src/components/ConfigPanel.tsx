
import React from 'react';
import { GenerationConfig, StylePresetId, AgeGroup, StoryTone, CharacterType } from '../types';
import { STYLE_LIBRARY, AGE_GROUPS, TONES, CHARACTERS } from '../constants';
import { Palette, User, Music, GraduationCap } from 'lucide-react';

interface ConfigPanelProps {
  config: GenerationConfig;
  onChange: (newConfig: GenerationConfig) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  
  const update = (key: keyof GenerationConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-100 animate-fade-in mt-6">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
          Director's Settings
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. ART STYLE */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
            <Palette size={16} /> Art Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(STYLE_LIBRARY) as [StylePresetId, any][]).map(([id, style]) => (
              <button
                key={id}
                onClick={() => update('styleId', id)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  config.styleId === id 
                    ? `border-amber-500 bg-amber-50 shadow-md transform scale-[1.02]` 
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`text-xs font-bold px-2 py-0.5 rounded-md inline-block mb-1 ${style.color.replace('text-', 'bg-').replace('bg-', 'text-opacity-20 ')}`}>
                   {style.name}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {style.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 2. TONE & AUDIENCE (Grid) */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* Tone */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
                <Music size={16} /> Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                 {(Object.entries(TONES) as [StoryTone, any][]).map(([id, tone]) => (
                  <button
                    key={id}
                    onClick={() => update('tone', id)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-between ${
                      config.tone === id
                        ? 'border-rose-400 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tone.label}</span>
                    <span>{tone.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

             {/* Audience - Restricted to Toddler and Elementary */}
             <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
                <GraduationCap size={16} /> Audience
              </label>
              <div className="grid grid-cols-2 gap-2">
                 {(Object.entries(AGE_GROUPS) as [AgeGroup, any][]).map(([id, age]) => (
                  <button
                    key={id}
                    onClick={() => update('ageGroup', id)}
                    className={`px-3 py-3 rounded-lg text-sm font-bold border transition-all text-center ${
                      config.ageGroup === id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};