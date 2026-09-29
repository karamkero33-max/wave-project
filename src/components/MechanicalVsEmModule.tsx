import React, { useState } from 'react';
import { mechanicalVsEmData } from '../data/comparisonData';
import { Volume2, VolumeX, Lightbulb, Wind, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const MechanicalVsEmModule: React.FC = () => {
  // Bell Jar vacuum experiment state
  const [isVacuum, setIsVacuum] = useState(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'bell-jar'>('comparison');

  return (
    <div className="space-y-6">
      {/* Section Header with Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Mechanical Waves vs. Electromagnetic Waves
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Understanding the distinction between waves requiring matter vs. waves self-propagating in vacuum.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Comprehensive Comparison Matrix
          </button>
          <button
            onClick={() => setActiveTab('bell-jar')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'bell-jar'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bell Jar Vacuum Experiment
          </button>
        </div>
      </div>

      {activeTab === 'comparison' ? (
        /* --- Comparison Table matching Image 2 --- */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80">
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">
                    Property
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-sky-400 uppercase tracking-wider w-[37.5%] border-l border-slate-800">
                    Mechanical Wave
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-amber-400 uppercase tracking-wider w-[37.5%] border-l border-slate-800">
                    Electromagnetic (EM) Wave
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {mechanicalVsEmData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      row.highlight ? 'bg-sky-950/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-200 align-top">
                      {row.aspect}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 border-l border-slate-800/60 align-top leading-relaxed">
                      {row.itemA}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 border-l border-slate-800/60 align-top leading-relaxed">
                      {row.itemB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Mechanical: Sound (343 m/s), Ocean Waves, Seismic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Electromagnetic: Light, Radio, X-Rays (c = 3.0 × 10⁸ m/s)</span>
            </div>
          </div>
        </div>
      ) : (
        /* --- Interactive Bell Jar Vacuum Simulator --- */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bell Jar Chamber Simulation */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-400 uppercase">
                Vacuum Chamber Simulation
              </span>
              <span className={`text-xs px-2.5 py-1 rounded font-medium ${
                isVacuum ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
              }`}>
                {isVacuum ? 'Chamber: Complete Vacuum (0 atm)' : 'Chamber: Normal Air (1.0 atm)'}
              </span>
            </div>

            {/* Bell Jar Visual Container */}
            <div className="relative w-72 h-80 flex flex-col items-center justify-end">
              {/* Glass Dome */}
              <div className="relative w-64 h-72 border-4 border-slate-600/80 rounded-t-full bg-sky-500/5 backdrop-blur-xs flex flex-col items-center justify-around p-4 shadow-inner">
                {/* Air particles dots inside dome */}
                {!isVacuum && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-sky-300/40 rounded-full animate-pulse"
                        style={{
                          top: `${20 + (i * 17) % 65}%`,
                          left: `${15 + (i * 23) % 70}%`,
                          animationDuration: `${1.5 + (i % 3) * 0.5}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Electric Bell Object */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-12 bg-amber-600/80 border border-amber-400 rounded-t-full shadow flex items-center justify-center">
                    <span className="text-[10px] font-bold text-amber-100">BELL</span>
                  </div>
                  {/* Vibrating hammer */}
                  <div className="w-1.5 h-8 bg-slate-300 origin-top animate-bounce"></div>
                  {/* Sound waves icon / status */}
                  <div className="mt-1 flex items-center gap-1">
                    {isVacuum ? (
                      <div className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
                        <VolumeX className="w-4 h-4" />
                        <span>Sound: 0 dB (Silent)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <Volume2 className="w-4 h-4" />
                        <span>Ringing (85 dB)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Glowing Light Bulb Object */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-amber-300/90 shadow-[0_0_30px_rgba(252,211,77,0.8)] border border-amber-200 flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-amber-950" />
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-amber-300 font-semibold">
                    Light: 100% Visible
                  </div>
                </div>
              </div>

              {/* Jar Heavy Metal Base with Vacuum Port */}
              <div className="w-72 h-8 bg-slate-800 border-2 border-slate-700 rounded-b-xl flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <Wind className="w-3.5 h-3.5" />
                <span>Vacuum Pump Hose Connector</span>
              </div>
            </div>

            {/* Interactive Vacuum Pump Toggle */}
            <div className="w-full mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setIsVacuum(!isVacuum)}
                className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isVacuum
                    ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {isVacuum ? 'Pump Air Back In (Refill Medium)' : 'Evacuate Air (Create Vacuum)'}
              </button>
            </div>
          </div>

          {/* Scientific Explanation & Observations */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-mono text-sky-400 uppercase tracking-wider">
                Laboratory Observation
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {isVacuum ? 'What Happens in a Vacuum?' : 'Observation Under Normal Atmospheric Air'}
              </h3>

              <div className="mt-4 space-y-3 text-xs leading-relaxed">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-semibold text-sky-300 mb-1 flex items-center gap-1.5">
                    <span>1. Acoustic Sound (Mechanical Wave)</span>
                  </div>
                  <p className="text-slate-300">
                    {isVacuum
                      ? 'The sound of the ringing bell completely disappears! Even though the striker continues to hit the gong, there are NO AIR PARTICLES in the vacuum to collide and carry vibrational kinetic energy to the glass.'
                      : 'The bell is loud and audible because air molecules vibrate and transfer acoustic pressure waves through the air to the glass dome and to your ears.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                    <span>2. Electric Light Bulb (Electromagnetic Wave)</span>
                  </div>
                  <p className="text-slate-300">
                    {isVacuum
                      ? 'The light bulb remains brightly visible without any dimming! Electromagnetic waves do not require matter; their oscillating electric and magnetic fields propagate freely through empty space.'
                      : 'Light travels effortlessly through air or vacuum at 3.0 × 10⁸ m/s, demonstrating that photons do not rely on material collisions.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-sky-950/30 border border-sky-800/60 rounded-xl text-xs text-sky-200">
              <strong className="text-sky-300">Key Takeaway for Exams:</strong> "Sound cannot travel through a vacuum, but light can."
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
