import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface PrintableHandoutProps {
  onBack: () => void;
}

export const PrintableHandout: React.FC<PrintableHandoutProps> = ({ onBack }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Non-print action header */}
      <div className="no-print flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Interactive Portal</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer shadow-md"
        >
          <Printer className="w-4 h-4" />
          <span>Print Worksheet / Handout (Ctrl+P)</span>
        </button>
      </div>

      {/* Printable Sheet Container (Styled for crisp paper printing & desktop view) */}
      <div className="p-8 sm:p-12 bg-white text-slate-950 rounded-2xl shadow-xl max-w-4xl mx-auto border border-slate-200 print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 mb-6">
          <div className="space-y-1">
            <div className="text-xs uppercase font-mono tracking-widest text-slate-600 font-bold">
              Physics Study Guide & Student Worksheet
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Wave Physics Mastery: Types, Properties & Formulas
            </h1>
            <p className="text-xs text-slate-600">
              Fundamental laws of wave motion: Transverse, Longitudinal, Surface, Mechanical vs EM, and Wave Equation.
            </p>
          </div>

          {/* QR Code Block */}
          <div className="flex flex-col items-center bg-slate-50 p-3 rounded-lg border border-slate-300 shrink-0 ml-4">
            <QRCodeSVG
              value={url || 'https://ais-dev-xn7vlqd2dc3jbnxu5ihyvy-764095025374.europe-west2.run.app'}
              size={96}
              level="H"
              fgColor="#020617"
              bgColor="#f8fafc"
            />
            <span className="text-[9px] font-bold text-slate-800 mt-1 uppercase tracking-tight">
              Scan for Interactive Lab
            </span>
          </div>
        </div>

        {/* Core Principles Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
            <div className="text-xs font-bold text-slate-900 uppercase">1. Transverse Wave</div>
            <p className="text-xs text-slate-700 mt-1">
              Particles move <strong>perpendicular (up & down)</strong> while wave moves forward.
            </p>
            <div className="text-[11px] text-slate-600 mt-2 font-mono">
              Features: Crest, Trough, Amplitude
            </div>
          </div>

          <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
            <div className="text-xs font-bold text-slate-900 uppercase">2. Longitudinal Wave</div>
            <p className="text-xs text-slate-700 mt-1">
              Particles move <strong>parallel (back & forth)</strong> in same direction as wave.
            </p>
            <div className="text-[11px] text-slate-600 mt-2 font-mono">
              Features: Compression, Rarefaction
            </div>
          </div>

          <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
            <div className="text-xs font-bold text-slate-900 uppercase">3. Surface Wave</div>
            <p className="text-xs text-slate-700 mt-1">
              Particles follow <strong>circular orbital paths</strong> at fluid boundary.
            </p>
            <div className="text-[11px] text-slate-600 mt-2 font-mono">
              Principle: Energy moves, matter stays!
            </div>
          </div>
        </div>

        {/* Summary Table: Mechanical vs EM */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Comparison Summary: Mechanical vs. Electromagnetic
          </h2>
          <table className="w-full text-xs border border-slate-400 border-collapse">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-slate-400 p-2 text-left font-bold w-1/4">Feature</th>
                <th className="border border-slate-400 p-2 text-left font-bold w-[37.5%]">Mechanical Wave</th>
                <th className="border border-slate-400 p-2 text-left font-bold w-[37.5%]">Electromagnetic (EM) Wave</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-400 p-1.5 font-semibold">Medium Required?</td>
                <td className="border border-slate-400 p-1.5">YES: Needs solid, liquid, or gas</td>
                <td className="border border-slate-400 p-1.5">NO: Propagates through empty vacuum</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-400 p-1.5 font-semibold">Speed in Vacuum</td>
                <td className="border border-slate-400 p-1.5">0 m/s (Cannot travel in vacuum)</td>
                <td className="border border-slate-400 p-1.5">c = 3.0 × 10⁸ m/s</td>
              </tr>
              <tr>
                <td className="border border-slate-400 p-1.5 font-semibold">Wave Type</td>
                <td className="border border-slate-400 p-1.5">Transverse OR Longitudinal</td>
                <td className="border border-slate-400 p-1.5">ALWAYS Transverse</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-400 p-1.5 font-semibold">Key Examples</td>
                <td className="border border-slate-400 p-1.5">Sound, Water waves, Seismic waves</td>
                <td className="border border-slate-400 p-1.5">Light, Radio, X-Rays, Microwaves</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Formulas & Parameters */}
        <div className="mb-6 p-4 border border-slate-300 rounded-lg bg-slate-50 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase">Core Wave Equation</div>
            <div className="text-lg font-bold font-mono text-slate-950 mt-0.5">
              v = f · λ
            </div>
            <div className="text-[11px] text-slate-600">
              v = Speed (m/s) · f = Frequency (Hz) · λ = Wavelength (m) · T = 1/f (Period in s)
            </div>
          </div>
          <div className="text-right text-xs text-slate-700">
            <div><strong>Amplitude (A):</strong> Height from baseline (Energy ∝ A²)</div>
            <div><strong>Wavelength (λ):</strong> Distance from crest to crest</div>
          </div>
        </div>

        {/* Student Quick Challenge Section (5 questions to solve) */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Student Quick Practice Questions
          </h2>
          <div className="space-y-3 text-xs text-slate-800">
            <div className="p-2.5 border border-slate-300 rounded-md">
              <p className="font-semibold">
                1. A wave has a frequency of 50 Hz and a wavelength of 6 metres. Calculate its wave speed:
              </p>
              <div className="mt-2 text-slate-400 font-mono">Answer: _______________________ (m/s)</div>
            </div>

            <div className="p-2.5 border border-slate-300 rounded-md">
              <p className="font-semibold">
                2. Explain why astronauts on the airless Moon must communicate via radio rather than shouting:
              </p>
              <div className="mt-2 text-slate-400 font-mono">Answer: __________________________________________________________________</div>
            </div>

            <div className="p-2.5 border border-slate-300 rounded-md">
              <p className="font-semibold">
                3. What happens to the energy transported by a wave if its amplitude is doubled?
              </p>
              <div className="mt-2 text-slate-400 font-mono">Answer: _______________________</div>
            </div>

            <div className="p-2.5 border border-slate-300 rounded-md">
              <p className="font-semibold">
                4. Which category does a sound wave in air belong to? (Circle one): Transverse / Longitudinal
              </p>
            </div>
          </div>
        </div>

        {/* Student name & date footer */}
        <div className="mt-8 pt-4 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
          <div>Student Name: _______________________</div>
          <div>Date: _______________________</div>
          <div>Score: ______ / 4</div>
        </div>
      </div>
    </div>
  );
};
