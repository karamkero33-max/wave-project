import React, { useState } from 'react';
import { Layers, ZoomIn, Eye, Sparkles, BookOpen } from 'lucide-react';

interface ChartCard {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  keyPoints: string[];
}

export const VisualChartsGallery: React.FC = () => {
  const [activeChart, setActiveChart] = useState<string>('chart1');

  const charts: ChartCard[] = [
    {
      id: 'chart1',
      title: 'Types of Waves: Different Ways to Wiggle!',
      subtitle: 'Transverse, Longitudinal & Surface Waves',
      category: 'Wave Classification',
      description: 'The foundation of wave mechanics: particles oscillate around fixed positions, transferring energy without permanently transferring matter.',
      keyPoints: [
        'Transverse: Particles move perpendicular (up & down) like a shaken rope.',
        'Longitudinal: Particles move parallel (back & forth) creating compressions & rarefactions.',
        'Surface Wave: Mixed circular orbital retrograde motion at the boundary of two media.',
        'Universal Truth: Waves transfer energy, not matter!',
      ],
    },
    {
      id: 'chart2',
      title: 'Mechanical Wave vs. Electromagnetic Wave',
      subtitle: 'Physical Medium vs. Vacuum Propagation',
      category: 'Radiation & Matter',
      description: 'A deep comparative taxonomy highlighting the requirement of material particles versus self-sustaining oscillating electromagnetic fields.',
      keyPoints: [
        'Mechanical: Needs solid, liquid, or gas medium (Sound, Seismic, Water).',
        'Electromagnetic: Propagates through empty space at c = 3.0 × 10⁸ m/s (Light, Radio, X-Rays).',
        'Vacuum Bell Jar: Sound vanishes in a vacuum, but light stays completely visible.',
        'Type Constraint: EM waves are always transverse, mechanical can be both.',
      ],
    },
    {
      id: 'chart3',
      title: 'Wavelength Comparison: Short vs. Long λ',
      subtitle: 'Frequency & Spatial Cycle Density',
      category: 'Wave Geometry',
      description: 'How cycle frequency and wavelength vary inversely at constant propagation speed (v = fλ).',
      keyPoints: [
        'Shorter Wavelength: High frequency, tightly clustered crests, higher energy photons.',
        'Longer Wavelength: Low frequency, broadly spaced oscillations, lower energy.',
        'Acoustics: High musical pitch = short wavelength, deep bass = long wavelength.',
      ],
    },
    {
      id: 'chart4',
      title: 'Amplitude vs. Wavelength Dimension Guide',
      subtitle: 'Vertical Displacement vs. Horizontal Length',
      category: 'Wave Parameters',
      description: 'Clear differentiation between vertical oscillation energy (Amplitude) and horizontal spatial period (Wavelength).',
      keyPoints: [
        'Amplitude (A): Measured vertically from center equilibrium baseline to peak crest or trough.',
        'Wavelength (λ): Measured horizontally between two identical consecutive points in phase.',
        'Energy Scale: Wave energy is proportional to Amplitude squared (E ∝ A²).',
        'Units: Both parameters are measured in standard SI metres (m).',
      ],
    },
  ];

  const current = charts.find((c) => c.id === activeChart) || charts[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Curated Visual Reference Charts
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Illustrated educational reference guides synthesized from introductory and college physics curricula.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs overflow-x-auto">
          {charts.map((chart, idx) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeChart === chart.id
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chart {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Chart Visual Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-mono text-sky-400 uppercase tracking-wider">
              {current.category}
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {current.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {current.subtitle}
            </p>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-200">Key Conceptual Takeaways:</div>
            <ul className="space-y-2">
              {current.keyPoints.map((pt, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-sky-400 font-bold">·</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive Stylized Diagram SVG */}
        <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[260px]">
          {activeChart === 'chart1' && (
            <div className="w-full space-y-3 text-xs">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-sky-400">1. Transverse:</span>
                <p className="text-[11px] text-slate-300">Oscillation ↕ Up/Down | Energy ➔ Forward</p>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-indigo-400">2. Longitudinal:</span>
                <p className="text-[11px] text-slate-300">Oscillation ↔ Back/Forth | Energy ➔ Forward</p>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-teal-400">3. Surface:</span>
                <p className="text-[11px] text-slate-300">Circular Orbital Retrogression ⟲ at Surface</p>
              </div>
            </div>
          )}

          {activeChart === 'chart2' && (
            <div className="w-full space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sky-400">Sound in Vacuum</div>
                  <div className="text-[11px] text-slate-400">No air particles to vibrate</div>
                </div>
                <div className="font-mono text-rose-400 font-bold">0 dB (Silent)</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-400">Light in Vacuum</div>
                  <div className="text-[11px] text-slate-400">Oscillating E & B fields</div>
                </div>
                <div className="font-mono text-emerald-400 font-bold">3.0 × 10⁸ m/s</div>
              </div>
            </div>
          )}

          {activeChart === 'chart3' && (
            <div className="w-full text-center space-y-2">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-mono text-base font-bold text-sky-300">v = f · λ</div>
                <div className="text-[11px] text-slate-400 mt-1">If speed v is constant, λ and f are inversely related</div>
              </div>
              <div className="text-[11px] text-slate-400">
                Double the frequency ➔ Half the wavelength
              </div>
            </div>
          )}

          {activeChart === 'chart4' && (
            <div className="w-full space-y-3 text-xs">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-300">Amplitude (A):</span>
                <p className="text-[11px] text-slate-300">Vertical baseline-to-crest distance</p>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-purple-300">Wavelength (λ):</span>
                <p className="text-[11px] text-slate-300">Horizontal crest-to-crest length</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
