import React, { useState } from 'react';
import { Header } from './components/Header';
import { QRCodeBanner } from './components/QRCodeBanner';
import { QRCodeModal } from './components/QRCodeModal';
import { WaveTypesModule } from './components/WaveTypesModule';
import { MechanicalVsEmModule } from './components/MechanicalVsEmModule';
import { WaveLabModule } from './components/WaveLabModule';
import { QuizModule } from './components/QuizModule';
import { VisualChartsGallery } from './components/VisualChartsGallery';
import { PrintableHandout } from './components/PrintableHandout';
import { Activity, QrCode, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('types');
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);

  const handleOpenPrintSheet = () => {
    setActiveTab('handout');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQR={() => setIsQRModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* If in Printable Handout Mode, display the dedicated printable worksheet */}
        {activeTab === 'handout' ? (
          <PrintableHandout onBack={() => setActiveTab('types')} />
        ) : (
          <>
            {/* Top Interactive QR Banner & Quick Introduction */}
            <div className="no-print">
              <QRCodeBanner
                onOpenModal={() => setIsQRModalOpen(true)}
                onPrintSheet={handleOpenPrintSheet}
              />
            </div>

            {/* Navigation Tabs (Secondary Filter Bar) */}
            <div className="no-print flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto text-xs font-medium">
                <button
                  onClick={() => setActiveTab('types')}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'types'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  1. Types of Waves
                </button>
                <button
                  onClick={() => setActiveTab('mechanical-em')}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'mechanical-em'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  2. Mechanical vs. EM Waves
                </button>
                <button
                  onClick={() => setActiveTab('parameters')}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'parameters'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  3. Amplitude & Wavelength Lab
                </button>
                <button
                  onClick={() => setActiveTab('charts')}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'charts'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  4. Reference Charts
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'quiz'
                      ? 'bg-emerald-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  5. Question Bank (25)
                </button>
              </div>

              <button
                onClick={() => setIsQRModalOpen(true)}
                className="hidden lg:flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Show QR Code</span>
              </button>
            </div>

            {/* Active Content View */}
            <div className="no-print">
              {activeTab === 'types' && <WaveTypesModule />}
              {activeTab === 'mechanical-em' && <MechanicalVsEmModule />}
              {activeTab === 'parameters' && <WaveLabModule />}
              {activeTab === 'charts' && <VisualChartsGallery />}
              {activeTab === 'quiz' && <QuizModule />}
            </div>
          </>
        )}
      </main>

      {/* Website Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400 font-medium">Wave Physics Lab & QR Portal</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Educational Science Suite</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5 text-sky-400" />
              <span>Mobile QR Code</span>
            </button>
            <button
              onClick={handleOpenPrintSheet}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Printable Sheet
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Practice Quiz
            </button>
          </div>
        </div>
      </footer>

      {/* QR Code Customizer & Share Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onPrintSheet={handleOpenPrintSheet}
      />
    </div>
  );
}
