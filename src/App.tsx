import { Minus, Square, X } from 'lucide-react'

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-body bg-[#000000]">
      {/* THE MONOLITH WINDOW */}
      <main className="relative w-full max-w-5xl aspect-[16/10] bg-surface-container/85 backdrop-blur-md monolith-border flex flex-col">
        {/* PRECISION CORNER DETAILS */}
        <div className="corner-detail corner-tl"></div>
        <div className="corner-detail corner-tr"></div>
        <div className="corner-detail corner-bl"></div>
        <div className="corner-detail corner-br"></div>

        {/* SYSTEM TOP BAR */}
        <header className="bg-neutral-900/85 backdrop-blur-md text-emerald-400 font-headline tracking-tighter uppercase text-xs border-b border-neutral-700/50 flex justify-between items-center h-8 px-4 w-full z-10 shrink-0">
          <div className="flex items-center gap-4">
            <span className="font-mono text-emerald-400 font-bold tracking-[0.2em]">SYSTEM: ACTIVE</span>
            <span className="text-neutral-500 font-mono">CORE_TERMINAL_V1.0.4</span>
          </div>
          <div className="flex gap-4">
            <Minus size={14} className="cursor-crosshair active:scale-95 text-neutral-500 hover:text-emerald-300 transition-colors duration-150" />
            <Square size={14} className="cursor-crosshair active:scale-95 text-neutral-500 hover:text-emerald-300 transition-colors duration-150" />
            <X size={14} className="cursor-crosshair active:scale-95 text-neutral-500 hover:text-emerald-300 transition-colors duration-150" />
          </div>
        </header>

        {/* MAIN CONTENT CANVAS */}
        <div className="flex flex-1 overflow-hidden">
          {/* Step 3 (Left Panel) and Step 4 (Right Panel) will go here */}
        </div>
        
        {/* Step 5 (Footer) will go here */}
      </main>
    </div>
  )
}

export default App
