import re

with open('src/components/HomeDashboard.tsx', 'r') as f:
    content = f.read()

if 'AICompanion' not in content and 'Noor AI' not in content:
    # Let's add it right after Quran
    quran_block_start = content.find("{/* Quran */}")
    if quran_block_start != -1:
        quran_block_end = content.find("</button>", quran_block_start) + 9
        
        ai_block = """
        {/* AI Companion */}
        <button
          onClick={() => setActiveTab('ai_companion')}
          className="col-span-1 sm:col-span-2 group relative bg-bg-surface border border-border-primary hover:border-[#c6a55e] rounded-3xl p-6 text-left transition-all hover:shadow-[0_0_20px_rgba(198,165,94,0.1)] hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-bl-[100px] -z-10 group-hover:bg-sky-500/20 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-bg-inset border border-border-primary flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/20">
              New
            </span>
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-1 font-serif-title">Noor AI</h3>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            Ask questions, seek knowledge, and learn about your Deen.
          </p>
        </button>
"""
        content = content[:quran_block_end] + "\n" + ai_block + content[quran_block_end:]

with open('src/components/HomeDashboard.tsx', 'w') as f:
    f.write(content)
