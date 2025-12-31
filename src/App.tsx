
import React, { useState } from "react";
import { HeroInput } from "./components/HeroInput";
import { StoryBoard } from "./components/StoryBoard";
import { LoadingView } from "./components/LoadingView";
import { Sidebar } from "./components/Sidebar";
import { LibraryView } from "./components/LibraryView";
import { ExploreView } from "./components/ExploreView";
import { ConfigPanel } from "./components/ConfigPanel";
import { generateStory, generateComicImages } from "./services/geminiService";
import { getStoryFromCache, saveStoryToCache } from "./utils/db";
import { StoryResponse, GenerationConfig, StylePresetId, StoryTone, CharacterType } from "./types";
import { STYLE_LIBRARY } from "./constants";
import { AlertCircle, SlidersHorizontal } from "lucide-react";

export type Tab = 'home' | 'explore' | 'library';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  // Default Configuration
  // 'auto' allows the AI to choose the best character for the story
  const [config, setConfig] = useState<GenerationConfig>({
    styleId: '3d-clay', 
    tone: 'adventure',
    characterType: 'auto', 
    ageGroup: 'elementary'
  });

  const checkApiKey = async () => {
    // Type checking for window.aistudio
    const aiStudio = (window as any).aistudio;
    if (aiStudio && aiStudio.hasSelectedApiKey) {
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey && aiStudio.openSelectKey) {
        await aiStudio.openSelectKey();
      }
    }
  };

  const handleSearch = async (topic: string, specificConfig?: GenerationConfig) => {
    // Ensure API Key is selected before starting generation
    await checkApiKey();

    setLoading(true);
    setError(null);
    setStory(null);
    setActiveTab('home');

    try {
      // Use specific config if passed (e.g. from Explore), otherwise use current state
      const finalConfig: GenerationConfig = specificConfig || config;

      // Step 1: Logic
      setLoadingStep("The Teacher is simplifying the concept...");
      
      // 2. Check Cache
      const cachedStory = await getStoryFromCache(topic);
      if (cachedStory && !specificConfig) {
         setStory(cachedStory);
         setLoading(false);
         return;
      }

      // Chain execution
      const textResultPromise = generateStory(topic, finalConfig);
      
      // Update UI for the optimized 3-stage pipeline
      setTimeout(() => { if(loading) setLoadingStep("The Author is writing the script..."); }, 2500);
      setTimeout(() => { if(loading) setLoadingStep("The Cinematographer is planning shots..."); }, 5000);

      const textResult = await textResultPromise;

      const styleName = STYLE_LIBRARY[finalConfig.styleId]?.name || "Custom";
      setLoadingStep(`The Animator is drawing (Batch Mode)...`);
      
      // Now generates 12 individual high-quality images in parallel batches
      const generatedImages = await generateComicImages(textResult);

      setLoadingStep("Binding the book...");
      
      // Map images directly to panels
      const finalPanels = textResult.panels.map((panel, index) => ({
        ...panel,
        imageUrl: generatedImages[index] || undefined,
      }));

      const finalStory: StoryResponse = { 
        ...textResult, 
        panels: finalPanels,
      };

      await saveStoryToCache(topic, finalStory);
      setStory(finalStory);

    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes('429')) {
        setError("Our artists are overwhelmed! Please try again in 1 minute.");
      } else {
        setError("Sorry, we couldn't create the story. Please try again later!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBook = () => {
    setStory(null);
  };

  return (
    <div className="flex w-full h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={(tab) => {
         setStory(null); 
         setActiveTab(tab);
      }} />

      {/* 2. Main Content Area */}
      <main className="flex-1 relative h-full overflow-hidden flex flex-col bg-white">
        
        {/* VIEW: Book Reader (Full Screen) */}
        {story ? (
          <StoryBoard story={story} onClose={handleCloseBook} />
        ) : (
          /* VIEW: Dashboard / Input */
          <div className="flex-1 overflow-y-auto relative scroll-smooth bg-slate-50">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30 fixed">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-sky-200 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full h-full p-6 md:p-12">
              {activeTab === 'home' && (
                <div className="flex flex-col items-center justify-center min-h-[80vh]">
                  
                  <HeroInput onSearch={handleSearch} isLoading={loading} />
                  
                  {loading && <LoadingView message={loadingStep} />}
                  
                  {error && (
                    <div className="mt-8 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-center gap-2 animate-shake">
                        <AlertCircle size={20} />
                        <span className="font-bold">{error}</span>
                    </div>
                  )}

                   {/* Toggle Config Panel */}
                   {!loading && !story && (
                     <div className="mt-12 w-full max-w-2xl">
                        <button 
                          onClick={() => setShowConfig(!showConfig)}
                          className="mx-auto flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors mb-4"
                        >
                           <SlidersHorizontal size={16} />
                           {showConfig ? "Hide Director Settings" : "Director Settings"}
                        </button>
                        
                        {showConfig && (
                           <ConfigPanel config={config} onChange={setConfig} />
                        )}
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'explore' && (
                <ExploreView onSelectTopic={(topic) => handleSearch(topic)} />
              )}

              {activeTab === 'library' && (
                <LibraryView onSelectStory={(s) => setStory(s)} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
