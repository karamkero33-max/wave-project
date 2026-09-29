import React from 'react';
import { QrCode, Sparkles, BookOpen, Layers, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQR: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenQR }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('types');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-sky-400 transition-colors flex items-center gap-2"
        >
          <Activity className="w-5 h-5 text-sky-400" />
          <span>Wave Physics Lab</span>
        </a>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('types')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'types' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Types of Waves
          </button>
          <button
            onClick={() => setActiveTab('mechanical-em')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'mechanical-em' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Mechanical vs EM
          </button>
          <button
            onClick={() => setActiveTab('parameters')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'parameters' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Amplitude & Wavelength
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'quiz' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Question Bank
          </button>
          <button
            onClick={() => setActiveTab('handout')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'handout' ? 'text-sky-400 font-semibold border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Printable Sheet
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQR}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-sky-300 bg-sky-950/60 border border-sky-800/80 rounded-lg hover:bg-sky-900/60 hover:border-sky-600 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Generate & View QR Code for this website"
          >
            <QrCode className="w-4 h-4 text-sky-400" />
            <span className="whitespace-nowrap">Scan Website QR</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            <span>Take Physics Quiz</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-900 bg-slate-950/95 py-2 px-1 text-xs">
        <button
          onClick={() => setActiveTab('types')}
          className={`px-2 py-1 rounded ${activeTab === 'types' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
        >
          Types
        </button>
        <button
          onClick={() => setActiveTab('mechanical-em')}
          className={`px-2 py-1 rounded ${activeTab === 'mechanical-em' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
        >
          Mech vs EM
        </button>
        <button
          onClick={() => setActiveTab('parameters')}
          className={`px-2 py-1 rounded ${activeTab === 'parameters' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
        >
          A & λ Lab
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-2 py-1 rounded ${activeTab === 'quiz' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
        >
          Questions
        </button>
        <button
          onClick={() => setActiveTab('handout')}
          className={`px-2 py-1 rounded ${activeTab === 'handout' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
        >
          Print
        </button>
      </div>
    </header>
  );
};
