import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Copy,
  Check,
  Sparkles,
  Heart,
  Share2,
  Compass,
} from 'lucide-react';
import { DuaItem } from '../types';
import { DUAS_COLLECTION } from '../data/zikrAndDuasData';

export const DuasSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('noor_favorite_duas');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const categories = [
    { id: 'all', label: 'All Duas' },
    { id: 'masjid', label: 'Masjid (Entering/Exiting)' },
    { id: 'salah', label: 'After Prayer (Salah)' },
    { id: 'morning_evening', label: 'Morning & Evening' },
    { id: 'forgiveness', label: 'Forgiveness (Istighfar)' },
    { id: 'daily', label: 'Daily Life & Food' },
    { id: 'travel', label: 'Travel & Safar' },
    { id: 'protection', label: 'Protection & Anxiety' },
  ];

  const filteredDuas = DUAS_COLLECTION.filter((d) => {
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.arabic.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n"${dua.translation}"\n\nReference: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (typeof window !== 'undefined') {
        localStorage.setItem('noor_favorite_duas', JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <div id="duas-section" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-bg-surface border border-border-primary rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c6a55e]/10 text-[#c6a55e] border border-[#c6a55e]/20 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Authentic Supplications (Adhkar)
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-serif-title">
              Daily & Occasional Islamic Duas
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Complete with authentic Arabic script, transliteration, English translation, and Hadith sources.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search supplication or meaning..."
              className="w-full bg-bg-inset border border-border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-[#c6a55e]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border-primary">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#c6a55e] text-bg-primary border-[#c6a55e] font-bold'
                  : 'bg-bg-inset border-border-primary text-text-secondary hover:border-border-hover hover:text-text-primary'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDuas.map((dua) => {
          const isFav = favorites.includes(dua.id);
          const isCopied = copiedId === dua.id;

          return (
            <div
              key={dua.id}
              id={`dua-card-${dua.id}`}
              className="bg-bg-surface border border-border-primary hover:border-[#c6a55e]/50 rounded-3xl p-6 shadow-lg flex flex-col justify-between space-y-4 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c6a55e] bg-[#c6a55e]/10 px-2 py-0.5 rounded-md border border-[#c6a55e]/20 font-serif-title">
                    {dua.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-base font-bold text-text-primary mt-1.5 font-serif-title">{dua.title}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavorite(dua.id)}
                    className={`p-2 rounded-xl border transition-all ${
                      isFav
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : 'bg-bg-inset border-border-primary text-text-secondary hover:text-text-primary'
                    }`}
                    title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleCopy(dua)}
                    className="p-2 rounded-xl bg-bg-inset border border-border-primary text-text-secondary hover:text-text-primary transition-all"
                    title="Copy full supplication text"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-[#c6a55e]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Arabic Calligraphy text */}
              <div className="bg-bg-inset border border-border-primary rounded-2xl p-4 text-right">
                <p className="font-arabic text-2xl sm:text-3xl text-[#c6a55e] leading-loose tracking-wide dir-rtl">
                  {dua.arabic}
                </p>
              </div>

              {/* Transliteration & English Translation */}
              <div className="space-y-2">
                <div className="text-xs text-[#c6a55e]/90 font-medium italic">
                  "{dua.transliteration}"
                </div>
                <div className="text-sm text-text-primary font-normal leading-relaxed">
                  {dua.translation}
                </div>
              </div>

              {/* When to Recite & Hadith Reference */}
              <div className="pt-3 border-t border-border-primary text-xs space-y-1">
                {dua.whenToRecite && (
                  <p className="text-text-secondary">
                    <strong className="text-[#c6a55e]">When:</strong> {dua.whenToRecite}
                  </p>
                )}
                <div className="text-[11px] font-mono text-text-secondary/70">
                  Ref: {dua.reference}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
