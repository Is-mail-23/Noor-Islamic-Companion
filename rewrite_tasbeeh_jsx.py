import re

with open('src/components/TasbeehCounter.tsx', 'r') as f:
    content = f.read()

# Find the start of the return statement
start_idx = content.find('  return (\n    <div id="tasbeeh-container"')
if start_idx == -1:
    print("Could not find return statement")
    exit(1)

new_jsx = """  return (
    <div id="tasbeeh-container" className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* 1. VIRTUAL TASBEEH AT TOP */}
      <div className="w-full">
        <div
          id="swipe-bead-stage"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            dragStartY.current = null;
            setBeadOffset(0);
          }}
          onWheel={handleWheel}
          onClick={handleTap}
          className="w-full relative select-none cursor-grab active:cursor-grabbing bg-radial from-bg-surface via-bg-inset to-bg-primary border border-border-primary rounded-3xl p-8 py-12 shadow-2xl overflow-hidden flex flex-col items-center justify-between min-h-[460px] sm:min-h-[500px] touch-none transition-all group"
        >
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#c6a55e]/20 via-transparent to-transparent" />

          {/* Top Display: Arabic Text & Meaning (Dynamically changes for packages) */}
          <div className="z-10 text-center max-w-lg pointer-events-none mb-6">
            <motion.div
              key={activeDisplayZikr.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="font-arabic text-4xl sm:text-5xl text-[#c6a55e] font-bold leading-normal tracking-wide drop-shadow-md">
                {activeDisplayZikr.arabic}
              </div>
              <div className="text-lg sm:text-xl font-semibold text-text-primary">
                {activeDisplayZikr.transliteration}
              </div>
              <div className="text-sm text-text-secondary max-w-md mx-auto">
                "{activeDisplayZikr.translation}"
              </div>
            </motion.div>
          </div>

          {/* Central Bead Thread & Tactile Swipe Beads */}
          <div className="relative my-4 flex flex-col items-center justify-center w-full h-56 pointer-events-none">
            {/* Golden/Silk Tasbeeh Thread */}
            <div className="absolute w-1.5 h-full bg-gradient-to-b from-[#c6a55e]/30 via-[#c6a55e]/70 to-[#c6a55e]/30 rounded-full shadow-sm" />

            {/* Central Active Large Bead with Swipe Offset */}
            <div
              style={{
                transform: `translateY(${beadOffset}px)`,
                transition: beadOffset === 0 ? 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              }}
              className="relative z-20 flex items-center justify-center"
            >
              {/* 3D Rendered Bead */}
              <div
                className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br ${activeBeadGradient} border-2 shadow-2xl flex flex-col items-center justify-center transform active:scale-95 transition-transform duration-100`}
              >
                {/* Bead Highlight shine */}
                <div className="absolute top-3 left-6 w-10 h-5 bg-white/30 rounded-full blur-[1px] transform -rotate-45" />

                {/* Count Number inside bead */}
                <span className="text-5xl sm:text-6xl font-bold font-mono text-text-primary tracking-tight drop-shadow-lg">
                  {count}
                </span>
                <span className="text-xs font-semibold text-[#c6a55e] tracking-wider uppercase mt-1">
                  of {target > 0 ? target : '∞'}
                </span>
              </div>
            </div>

            {/* Upper Bead Preview */}
            <div
              style={{
                transform: `translateY(${beadOffset * 0.5}px)`,
                transition: beadOffset === 0 ? 'transform 0.25s ease' : 'none',
              }}
              className={`absolute -top-8 w-16 h-16 rounded-full bg-gradient-to-br ${activeBeadGradient} opacity-40 border shadow-md flex items-center justify-center`}
            >
              {swipeDirection === 'down' && (
                <div className="text-sm text-text-primary/70 font-mono font-bold">{(count + 1) % (target || 999)}</div>
              )}
            </div>

            {/* Lower Bead (sliding down) */}
            <div
              style={{
                transform: `translateY(${beadOffset * 0.7}px)`,
                transition: beadOffset === 0 ? 'transform 0.25s ease' : 'none',
              }}
              className={`absolute -bottom-8 w-16 h-16 rounded-full bg-gradient-to-br ${activeBeadGradient} opacity-30 border shadow-md flex items-center justify-center`}
            >
              {swipeDirection === 'up' && (
                <div className="text-sm text-text-primary/70 font-mono font-bold">{(count + 1) % (target || 999)}</div>
              )}
            </div>
          </div>

          {/* Bottom: Swipe indicator guide */}
          <div className="z-10 flex flex-col items-center text-center pointer-events-none mt-6">
            <motion.div
              animate={{ y: swipeDirection === 'down' ? [0, 6, 0] : [0, -6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-1.5 text-xs text-[#c6a55e] font-semibold bg-[#c6a55e]/10 px-4 py-2 rounded-full border border-[#c6a55e]/20"
            >
              {swipeDirection === 'down' ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
              Swipe {swipeDirection === 'down' ? 'Down' : 'Up'} to Count Bead
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. COUNTINGS BENEATH THAT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Progress Card */}
        <div className="bg-bg-surface border border-border-primary rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-text-primary font-serif-title">Current Loop Progress</h3>
            <span className="text-sm font-bold text-[#c6a55e] font-mono">
              {target > 0 ? `${Math.round((count / target) * 100)}%` : 'Free Count'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-bg-inset h-3.5 rounded-full overflow-hidden border border-border-primary">
            <motion.div
              className="h-full bg-gradient-to-r from-[#c6a55e] to-[#f0d696] rounded-full"
              animate={{ width: target > 0 ? `${Math.min(100, (count / target) * 100)}%` : '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Completed Loops & Total Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-primary shadow-sm flex flex-col items-center justify-center">
            <span className="text-xs text-text-secondary mb-1">Completed Loops</span>
            <span className="text-3xl font-bold font-mono text-[#c6a55e]">{completedCycles}</span>
          </div>
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-primary shadow-sm flex flex-col items-center justify-center">
            <span className="text-xs text-text-secondary mb-1">Total Lifetime</span>
            <span className="text-3xl font-bold font-mono text-text-primary">{totalLifetimeCount}</span>
          </div>
        </div>
      </div>

      {/* 3. ZIKR PACKAGES & OPTIONS DOWNSIDE */}
      <div className="bg-bg-surface border border-border-primary rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-text-primary font-serif-title mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#c6a55e]" />
          Zikr Packages & Selection
        </h3>

        {/* Fatimah Package (Special Highlight) */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
            Recommended Package
          </label>
          <button
            onClick={() => selectPreset(FATIMAH_PACKAGE)}
            className={`w-full relative p-4 rounded-xl border text-left transition-all duration-200 ${
              selectedZikr.id === FATIMAH_PACKAGE_ID
                ? 'bg-[#1c222a] border-[#c6a55e] shadow-lg ring-1 ring-[#c6a55e]/40'
                : 'bg-bg-inset border-border-primary hover:border-[#c6a55e]/50 hover:bg-bg-surface'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`font-bold text-base ${selectedZikr.id === FATIMAH_PACKAGE_ID ? 'text-[#c6a55e]' : 'text-text-primary'}`}>
                {FATIMAH_PACKAGE.transliteration}
              </span>
              {selectedZikr.id === FATIMAH_PACKAGE_ID && <CheckCircle2 className="w-5 h-5 text-[#c6a55e]" />}
            </div>
            <div className="text-sm text-text-secondary mb-1">
              Subhan Allah (33) → Alhamdulillah (33) → Allahu Akbar (34)
            </div>
            <div className="text-xs text-text-secondary/70">
              The names of Zikr will automatically change as you swipe through the 100 counts.
            </div>
          </button>
        </div>

        {/* 3 Primary Zikrs */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
            Single Zikrs (Standard)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ZIKR_PRESETS.slice(0, 3).map((item) => {
              const isSelected = selectedZikr.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => selectPreset(item)}
                  className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#1c222a] border-[#c6a55e] text-text-primary ring-1 ring-[#c6a55e]/40'
                      : 'bg-bg-inset border-border-primary hover:border-border-hover text-text-secondary hover:bg-bg-surface'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-text-primary">{item.transliteration}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#c6a55e]" />}
                  </div>
                  <div className="text-right font-arabic text-xl text-[#c6a55e] dir-rtl mb-1">
                    {item.arabic}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* And More Zikrs Expandable row */}
        <div className="pt-4 border-t border-border-primary">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              More Remembrances
            </span>
            <button
              onClick={() => setCustomZikrOpen(!customZikrOpen)}
              className="text-xs text-[#c6a55e] hover:text-[#d6b772] flex items-center gap-1 font-semibold"
            >
              <BookmarkPlus className="w-4 h-4" />
              Add Custom Dhikr
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ZIKR_PRESETS.slice(3).map((item) => {
              const isSelected = selectedZikr.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => selectPreset(item)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    isSelected
                      ? 'bg-[#c6a55e] text-bg-primary font-bold border-[#c6a55e]'
                      : 'bg-bg-inset border-border-primary text-text-secondary hover:bg-bg-surface hover:text-text-primary'
                  }`}
                >
                  {item.transliteration} ({item.defaultTarget})
                </button>
              );
            })}
          </div>

          {/* Custom Dhikr Input Form */}
          {customZikrOpen && (
            <form onSubmit={handleSaveCustomZikr} className="mt-4 p-4 rounded-xl bg-bg-inset border border-border-primary space-y-3">
              <div className="text-sm font-semibold text-text-primary">Set Custom Dhikr Phrase</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Dhikr in English (e.g. Ya Hayyu Ya Qayyum)"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="bg-bg-surface border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-[#c6a55e]"
                  required
                />
                <input
                  type="text"
                  placeholder="Arabic text (optional: يَا حَيُّ يَا قَيُّومُ)"
                  value={customArabic}
                  onChange={(e) => setCustomArabic(e.target.value)}
                  className="bg-bg-surface border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-[#c6a55e] font-arabic text-right"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCustomZikrOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm bg-[#c6a55e] hover:bg-[#d6b772] text-bg-primary font-bold"
                >
                  Start Custom Dhikr
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 4. OTHER SETTINGS BENEATH ALL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bead Theme Customizer */}
        <div className="bg-bg-surface border border-border-primary rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider font-serif-title">
            Tasbeeh Bead Material
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setBeadTheme('amber')}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                beadTheme === 'amber'
                  ? 'border-[#c6a55e] bg-[#c6a55e]/15 text-[#c6a55e] font-bold'
                  : 'border-border-primary bg-bg-inset text-text-secondary hover:border-border-hover'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#c6a55e] to-[#8d6f30] shadow" />
              <span className="text-xs">Gold Wood</span>
            </button>

            <button
              onClick={() => setBeadTheme('emerald')}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                beadTheme === 'emerald'
                  ? 'border-[#52b788] bg-[#1b4332]/40 text-[#52b788] font-bold'
                  : 'border-border-primary bg-bg-inset text-text-secondary hover:border-border-hover'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#081c15] shadow" />
              <span className="text-xs">Emerald</span>
            </button>

            <button
              onClick={() => setBeadTheme('pearl')}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                beadTheme === 'pearl'
                  ? 'border-text-primary bg-white/10 text-text-primary font-bold'
                  : 'border-border-primary bg-bg-inset text-text-secondary hover:border-border-hover'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white to-text-secondary shadow" />
              <span className="text-xs">White Pearl</span>
            </button>
          </div>
        </div>

        {/* Quick controls: Direction, Sound, Vibration, Reset */}
        <div className="bg-bg-surface border border-border-primary rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider font-serif-title flex justify-between items-center">
            Settings & Controls
            <button
              onClick={handleReset}
              title="Reset current count"
              className="px-2 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs rounded border border-rose-500/20 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSwipeDirection(d => d === 'down' ? 'up' : 'down')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border-primary bg-bg-inset text-text-primary hover:border-border-hover transition-all"
            >
              <ArrowDownUp className="w-5 h-5 text-[#c6a55e]" />
              <span className="text-xs">{swipeDirection === 'down' ? 'Swipe Down' : 'Swipe Up'}</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-[#c6a55e]/15 border-[#c6a55e]/30 text-[#c6a55e]'
                  : 'bg-bg-inset border-border-primary text-text-secondary'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-xs">Sound {soundEnabled ? 'On' : 'Off'}</span>
            </button>

            <button
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                vibrationEnabled
                  ? 'bg-[#c6a55e]/15 border-[#c6a55e]/30 text-[#c6a55e]'
                  : 'bg-bg-inset border-border-primary text-text-secondary'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-xs">Haptic {vibrationEnabled ? 'On' : 'Off'}</span>
            </button>
          </div>
          
          {/* Loop Target Setting */}
          <div className="pt-3 border-t border-border-primary">
            <label className="text-xs text-text-secondary block mb-2 font-medium">Custom Target Per Loop:</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[33, 99, 100, 0].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTarget(t);
                    if (t > 0 && count >= t) setCount(0);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    target === t
                      ? 'bg-[#c6a55e] text-bg-primary border-[#c6a55e] font-bold'
                      : 'bg-bg-inset border-border-primary text-text-secondary hover:bg-bg-surface hover:text-text-primary'
                  }`}
                >
                  {t === 0 ? 'Free' : t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
"""

content = content[:start_idx] + new_jsx

with open('src/components/TasbeehCounter.tsx', 'w') as f:
    f.write(content)

