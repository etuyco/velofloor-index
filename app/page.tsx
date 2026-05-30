import { Layers, Lock } from "lucide-react";
import Countdown from "./components/Countdown";
import WaitlistForm from "./components/WaitlistForm";

export default function Home() {
  return (
    <>
      {/* Minimal Centered Branding Logo (No Links or Buttons) */}
      <header className="w-full pt-10 pb-6 flex justify-center z-10 relative">
        <div className="flex items-center gap-3 text-brand-forest">
          <div className="w-10 h-10 bg-brand-forest rounded-lg flex items-center justify-center text-white shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-3xl tracking-tight-display text-brand-ink">
            Velofloor
          </span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center py-12 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-brand-forest/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center opacity-0 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-brand-sand rounded-full font-mono text-[10px] font-bold text-brand-slate uppercase tracking-wide-mono shadow-sm mb-6">
            <Lock className="w-3 h-3 text-brand-forest" /> Private Beta Waitlist
          </div>

          {/* Balanced layout forced onto exactly two lines using whitespace-nowrap */}
          <h1 className="font-display font-black text-[6.5vw] sm:text-5xl md:text-6xl lg:text-[4.5rem] tracking-tight-display leading-[1.15] text-brand-ink w-full max-w-none mx-auto mb-6">
            <span className="xl:whitespace-nowrap">
              Bring the energy of the{" "}
              <span className="text-brand-forest underline decoration-brand-emerald/40 decoration-[6px] md:decoration-8 underline-offset-4">
                office
              </span>
            </span>
            <br />
            <span className="xl:whitespace-nowrap">to your remote team.</span>
          </h1>

          {/* Optimized two-sentence copy highlighting 'replaces' */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Velofloor is a Virtual Headquarters built to restore natural
            accountability and visibility to distributed companies. Our
            persistent digital environment{" "}
            <span className="text-red-500">replaces</span> invasive screen
            trackers with frictionless, face-to-face team collaboration.
          </p>

          {/* Live Launch Countdown Component */}
          <Countdown />

          {/* Compelling Conversion Form */}
          <WaitlistForm />
        </div>
      </main>

      {/* Super Clean Static Footer (Strictly No Actionable Links/Buttons) */}
      <footer className="w-full py-8 text-center text-xs text-gray-400 font-mono uppercase tracking-wide-mono border-t border-brand-sand mt-auto z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Velofloor Inc. All rights reserved. Alberta, Canada.</p>
          <div className="flex gap-4">
            <span>SOC 2 Type II Ready</span>
            <span>•</span>
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </footer>
    </>
  );
}
