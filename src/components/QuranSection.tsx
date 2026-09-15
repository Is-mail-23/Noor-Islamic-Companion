import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Search,
  Sparkles,
  Volume2,
  Copy,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { QURAN_SURAHS } from '../data/quranData';
import { QuranSurah } from '../types';

export const QuranSection: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah>(QURAN_SURAHS[0]);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

  const handleCopyVerse = (verseNum: number, arabic: string, translation: string) => {
    navigator.clipboard.writeText(
      `Surah ${selectedSurah.name} (${selectedSurah.number}:${verseNum})\n\n${arabic}\n\n${translation}`
    );
    setCopiedVerse(verseNum);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  return (
    <div id="quran-section" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-bg-surface border border-border-primary rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c6a55e]/10 text-[#c6a55e] border border-[#c6a55e]/20 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              The Holy Quran
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-serif-title">
              Noble Quran Connection & Reader
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Connected reading portal with verse-by-verse translation, Arabic script, and core Surahs.
            </p>
          </div>

          <div className="text-xs bg-bg-inset border border-[#c6a55e]/30 rounded-2xl p-3 text-[#c6a55e] max-w-xs">
            <span className="font-bold block mb-0.5 font-serif-title">🌟 Quran Expansion Ready:</span>
            Essential Surahs are connected. Full 114 Surahs and audio reciter are primed for additional expansion.
          </div>
        </div>

        {/* Surah Selection Pills */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border-primary">
          {QURAN_SURAHS.map((surah) => {
            const isSelected = selectedSurah.number === surah.number;
            return (
              <button
                key={surah.number}
                onClick={() => setSelectedSurah(surah)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#c6a55e] text-bg-primary border-[#c6a55e] font-bold shadow-md'
                    : 'bg-bg-inset border-border-primary text-text-secondary hover:border-border-hover hover:text-text-primary'
                }`}
              >
                <span className="font-mono text-[10px] opacity-70">#{surah.number}</span>
                <span>{surah.name}</span>
                <span className="font-arabic text-sm">{surah.arabicName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Surah Presentation */}
      <div className="bg-bg-surface border border-border-primary rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
        {/* Surah Banner */}
        <div className="text-center space-y-3 pb-6 border-b border-border-primary">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c6a55e] bg-[#c6a55e]/10 px-3 py-1 rounded-full border border-[#c6a55e]/30 font-serif-title">
            Surah {selectedSurah.number} • {selectedSurah.revelationType} • {selectedSurah.versesCount} Ayahs
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary font-arabic pt-2">
            سورة {selectedSurah.arabicName}
          </h2>
          <div className="text-lg font-bold text-text-primary font-serif-title">{selectedSurah.name}</div>
          <p className="text-xs text-text-secondary">"{selectedSurah.englishTranslation}"</p>

          {/* Bismillah (except Surah 9) */}
          {selectedSurah.number !== 9 && (
            <div className="py-4">
              <div className="font-arabic text-2xl sm:text-3xl text-[#c6a55e] tracking-wide dir-rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <p className="text-xs text-text-secondary italic mt-1">
                In the Name of Allah—the Most Compassionate, Most Merciful.
              </p>
            </div>
          )}
        </div>

        {/* Verses List */}
        <div className="space-y-6">
          {selectedSurah.verses.map((verse) => (
            <div
              key={verse.number}
              className="p-5 rounded-2xl bg-bg-inset border border-border-primary hover:border-[#c6a55e]/30 transition-all space-y-3"
            >
              {/* Top row: Ayah number and actions */}
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#c6a55e]/15 border border-[#c6a55e]/30 text-[#c6a55e] font-mono text-xs font-bold flex items-center justify-center">
                  {verse.number}
                </span>

                <button
                  onClick={() => handleCopyVerse(verse.number, verse.arabic, verse.translation)}
                  className="p-2 rounded-xl bg-bg-surface border border-border-primary text-text-secondary hover:text-text-primary transition-colors"
                  title="Copy Ayah text"
                >
                  {copiedVerse === verse.number ? (
                    <Check className="w-3.5 h-3.5 text-[#c6a55e]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Arabic verse text */}
              <div className="text-right py-2">
                <p className="font-arabic text-2xl sm:text-3xl text-text-primary leading-loose tracking-wide dir-rtl">
                  {verse.arabic}
                </p>
              </div>

              {/* Transliteration */}
              {verse.transliteration && (
                <div className="text-xs text-[#c6a55e]/80 italic font-medium">
                  {verse.transliteration}
                </div>
              )}

              {/* Translation */}
              <div className="text-sm text-text-primary leading-relaxed pt-1">
                {verse.translation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
