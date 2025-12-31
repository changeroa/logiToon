import React, { useEffect, useState } from "react";
import { StoryResponse } from "../types";
import { getAllStories, deleteStoryFromCache } from "../utils/db";
import { PlayCircle, SearchX, Trash2, Clock } from "lucide-react";

interface LibraryViewProps {
  onSelectStory: (story: StoryResponse) => void;
}

// Extend StoryResponse locally to include DB fields
interface SavedStory extends StoryResponse {
  topic: string;
  timestamp: number;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onSelectStory }) => {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await getAllStories();
      setStories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, topic: string) => {
    e.stopPropagation();
    if (window.confirm("Do you want to delete this comic?")) {
      await deleteStoryFromCache(topic);
      setStories(prev => prev.filter(s => s.topic !== topic));
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("en-US", {
      month: 'short', day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-xs font-bold">Loading Library...</p>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[50vh]">
        <div className="bg-slate-100 p-6 rounded-full mb-4 animate-pulse">
          <SearchX size={48} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-600">Library is Empty</h3>
        <p className="text-sm mt-2 max-w-[200px] mx-auto">
          Create a story or explore topics to fill your collection!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      <div className="mb-8 border-b border-slate-200 pb-4">
         <h2 className="text-3xl font-black text-slate-800 tracking-tight">My Library</h2>
         <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wide">{stories.length} Stories Saved</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stories.map((story) => (
          <div
            key={story.topic}
            onClick={() => onSelectStory(story)}
            className="group relative aspect-[3/4] bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            {/* Thumbnail */}
            {story.panels[0]?.imageUrl ? (
              <img
                src={story.panels[0].imageUrl}
                alt={story.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center">
                  <PlayCircle className="text-slate-200" size={40} />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80" />

            {/* Delete Button */}
            <button
              onClick={(e) => handleDelete(e, story.topic)}
              className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-white backdrop-blur-md rounded-full text-white/70 hover:text-rose-500 transition-colors z-20 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-4 text-left">
              <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-bold uppercase mb-2">
                 <Clock size={12} />
                 <span>{formatDate(story.timestamp)}</span>
              </div>
              <h3 className="text-white font-extrabold text-lg leading-tight line-clamp-2 drop-shadow-md pr-1">
                {story.title}
              </h3>
            </div>

            {/* Hover Play Effect */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/40">
                  <PlayCircle className="text-white w-6 h-6 fill-white/20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
