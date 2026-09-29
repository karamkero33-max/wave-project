import React, { useState, useEffect, useRef } from 'react';
import { amplitudeVsWavelengthData } from '../data/comparisonData';
import { Volume2, VolumeX, Play, Pause, RotateCcw, SplitSquareVertical, Calculator } from 'lucide-react';
import { startWaveTone, stopWaveTone } from '../utils/audio';

export const WaveLabModule: React.FC = () => {
  const [amplitude, setAmplitude] = useState<number>(1.5); // meters
  const [wavelength, setWavelength] = useState<number>(4.0); // meters
  const [frequency, setFrequency] = useState<number>(1.2); // Hz
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'comparison' | 'matrix'>('interactive');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dualCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Computed Wave Parameters
  const waveSpeed = frequency * wavelength; // v = f * lambda
  const period = 1 / frequency; // T = 1 / f

  // Handle continuous audio tone
  useEffect(() => {
    if (isAudioOn && isPlaying) {
      startWaveTone(frequency, amplitude);
    } else {
      stopWaveTone();
    }
    return () => {
      stopWaveTone();
    };
  }, [isAudioOn, isPlaying, frequency, amplitude]);

  // Main interactive wave canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewMode !== 'interactive') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        timeRef.current += dt * frequency * Math.PI * 2;
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const t = timeRef.current;

      // Clear Canvas
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Equilibrium Centerline
      ctx.strokeStyle = '#475569';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pixel scale factors
      const pxPerMeterX = 45; // 1 meter = 45px
      const pxPerMeterY = 32; // 1 meter = 32px

      const ampPx = amplitude * pxPerMeterY;
      const lambdaPx = wavelength * pxPerMeterX;
      const k = (2 * Math.PI) / lambdaPx;

      // Draw Sine Wave
      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8'; // sky-400
      ctx.lineWidth = 3;
      for (let x = 0; x <= width; x += 2) {
        const y = centerY - Math.sin(k * x - t) * ampPx;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Find Crest near center for dimension labels
      let crestPhase = (Math.PI / 2 + t) % (2 * Math.PI);
      if (crestPhase < 0) crestPhase += 2 * Math.PI;
      let crest1X = crestPhase / k;
      while (crest1X < 120) crest1X += lambdaPx;
      const crest2X = crest1X + lambdaPx;

      // 1. Draw Wavelength (λ) dimension marker between two successive crests
      if (crest1X < width - 40 && crest2X < width + 40) {
        const markerY = centerY - ampPx - 25;
        ctx.strokeStyle = '#a855f7'; // purple-500
        ctx.lineWidth = 2;

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(crest1X, markerY);
        ctx.lineTo(Math.min(width - 20, crest2X), markerY);
        ctx.stroke();

        // Ticks at crests
        ctx.beginPath();
        ctx.moveTo(crest1X, markerY - 6);
        ctx.lineTo(crest1X, centerY - ampPx);
        ctx.stroke();

        if (crest2X < width) {
          ctx.beginPath();
          ctx.moveTo(crest2X, markerY - 6);
          ctx.lineTo(crest2X, centerY - ampPx);
          ctx.stroke();
        }

        // Dimension text
        ctx.fillStyle = '#d8b4fe';
        ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
        const labelMidX = (crest1X + Math.min(width - 20, crest2X)) / 2;
        ctx.fillText(`Wavelength λ = ${wavelength.toFixed(1)} m`, labelMidX - 60, markerY - 8);
      }

      // 2. Draw Amplitude (A) dimension marker at crest1X
      if (crest1X < width - 40) {
        const markerX = crest1X;
        ctx.strokeStyle = '#f59e0b'; // amber-500
        ctx.lineWidth = 2;

        // Vertical arrow from center to crest
        ctx.beginPath();
        ctx.moveTo(markerX, centerY);
        ctx.lineTo(markerX, centerY - ampPx);
        ctx.stroke();

        // Arrow heads
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(markerX, centerY - ampPx);
        ctx.lineTo(markerX - 4, centerY - ampPx + 6);
        ctx.lineTo(markerX + 4, centerY - ampPx + 6);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(markerX, centerY);
        ctx.lineTo(markerX - 4, centerY - 6);
        ctx.lineTo(markerX + 4, centerY - 6);
        ctx.fill();

        // Label
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
        ctx.fillText(`Amplitude A = ${amplitude.toFixed(1)} m`, markerX + 10, centerY - ampPx / 2 + 4);
      }

      // Labels on crest and trough
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      if (crest1X < width - 20) {
        ctx.fillText('Peak / Crest', crest1X - 25, centerY - ampPx - 6);
      }

      const troughX = crest1X + lambdaPx / 2;
      if (troughX < width - 20) {
        ctx.fillStyle = '#60a5fa';
        ctx.fillText('Trough', troughX - 16, centerY + ampPx + 18);
        ctx.beginPath();
        ctx.arc(troughX, centerY + ampPx, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [amplitude, wavelength, frequency, isPlaying, viewMode]);

  // Dual Canvas Comparison (Shorter Wavelength vs Longer Wavelength matching Image 3)
  useEffect(() => {
    const canvas = dualCanvasRef.current;
    if (!canvas || viewMode !== 'comparison') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const renderDual = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      const midX = w / 2;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      // Divider line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, h);
      ctx.stroke();

      const centerY = h / 2 + 10;
      const amp = 45;

      // Left: Shorter Wavelength (High Frequency)
      const lambdaShort = 50;
      const kShort = (2 * Math.PI) / lambdaShort;
      ctx.beginPath();
      ctx.strokeStyle = '#0284c7'; // dark sky
      ctx.lineWidth = 3;
      for (let x = 10; x <= midX - 10; x += 2) {
        const y = centerY - Math.sin(kShort * x - t * 2) * amp;
        if (x === 10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
      ctx.fillText('Shorter Wavelength (λ₁)', 40, 36);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Plus Jakarta Sans, sans-serif';
      ctx.fillText('More waves per second (Higher Frequency)', 40, 54);

      // Bracket for shorter wavelength
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(100, 75);
      ctx.lineTo(100 + lambdaShort, 75);
      ctx.stroke();
      ctx.fillText('λ₁ (short)', 100, 95);

      // Right: Longer Wavelength (Low Frequency)
      const lambdaLong = 140;
      const kLong = (2 * Math.PI) / lambdaLong;
      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      for (let x = midX + 10; x <= w - 10; x += 2) {
        const relX = x - midX;
        const y = centerY - Math.sin(kLong * relX - t) * amp;
        if (x === midX + 10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
      ctx.fillText('Longer Wavelength (λ₂)', midX + 40, 36);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Plus Jakarta Sans, sans-serif';
      ctx.fillText('Fewer waves per second (Lower Frequency)', midX + 40, 54);

      // Bracket for longer wavelength
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(midX + 100, 75);
      ctx.lineTo(midX + 100 + lambdaLong, 75);
      ctx.stroke();
      ctx.fillText('λ₂ (long)', midX + 140, 95);

      animId = requestAnimationFrame(renderDual);
    };

    animId = requestAnimationFrame(renderDual);
    return () => cancelAnimationFrame(animId);
  }, [viewMode]);

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Amplitude & Wavelength Physics Lab
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore the wave equation <span className="font-mono text-sky-400">v = f × λ</span> with real-time interactive parameters and live dimensions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'interactive' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Generator
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'comparison' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Short vs. Long λ Diagram
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'matrix' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            A vs λ Comparison Matrix
          </button>
        </div>
      </div>

      {viewMode === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Wave Canvas */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-sky-400 uppercase">
                Dynamic Wave Displacement Graph y(x, t)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    isAudioOn
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-white'
                  }`}
                  title="Synthesize audio tone from frequency and amplitude"
                >
                  {isAudioOn ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isAudioOn ? 'Audio Tone On' : 'Hear Frequency'}</span>
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isPlaying ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
              </div>
            </div>

            <div className="relative w-full aspect-[16/9] max-h-[340px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
              <canvas
                ref={canvasRef}
                width={760}
                height={340}
                className="w-full h-full object-contain block"
              />
            </div>

            {/* Live Sliders Deck */}
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Amplitude Slider */}
              <div className="space-y-1.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-300">Amplitude (A):</span>
                  <span className="font-mono text-white tabular-nums">{amplitude.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.1"
                  value={amplitude}
                  onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">Controls height / loudness / energy</p>
              </div>

              {/* Wavelength Slider */}
              <div className="space-y-1.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-purple-300">Wavelength (λ):</span>
                  <span className="font-mono text-white tabular-nums">{wavelength.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="8.0"
                  step="0.5"
                  value={wavelength}
                  onChange={(e) => setWavelength(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">Distance between crest to crest</p>
              </div>

              {/* Frequency Slider */}
              <div className="space-y-1.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sky-300">Frequency (f):</span>
                  <span className="font-mono text-white tabular-nums">{frequency.toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="4.0"
                  step="0.1"
                  value={frequency}
                  onChange={(e) => setFrequency(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">Oscillations per second / pitch</p>
              </div>
            </div>
          </div>

          {/* Computed Physics Calculations & Formula Cards */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400 uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                <span>The Wave Equation</span>
              </div>

              <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-xl font-bold font-mono text-sky-300">
                  v = f · λ
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Speed = Frequency × Wavelength
                </div>
              </div>

              {/* Live Calculated Metric Cards */}
              <div className="mt-4 space-y-2.5">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">Propagation Speed (v)</div>
                    <div className="text-xs text-slate-300">v = {frequency.toFixed(1)} × {wavelength.toFixed(1)}</div>
                  </div>
                  <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                    {waveSpeed.toFixed(2)} m/s
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">Wave Period (T = 1/f)</div>
                    <div className="text-xs text-slate-300">Time per single cycle</div>
                  </div>
                  <div className="text-base font-bold font-mono text-sky-400 tabular-nums">
                    {period.toFixed(2)} s
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">Relative Energy (E ∝ A²)</div>
                    <div className="text-xs text-slate-300">Proportional to amplitude squared</div>
                  </div>
                  <div className="text-base font-bold font-mono text-amber-400 tabular-nums">
                    {(amplitude * amplitude).toFixed(2)} A²
                  </div>
                </div>
              </div>
            </div>

            {/* Quick summary note */}
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-200">Rule of Thumb:</span> A <em>taller</em> wave has greater amplitude. A <em>wider</em> wave has greater wavelength.
            </div>
          </div>
        </div>
      )}

      {/* View Mode 2: Shorter vs Longer Wavelength Diagram matching Image 3 */}
      {viewMode === 'comparison' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">
              Shorter Wavelength vs. Longer Wavelength
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Visualizing how wave spacing affects frequency when wave speed is held constant (based on classical wave physics diagrams).
            </p>
          </div>

          <div className="relative w-full aspect-[2/1] max-h-[360px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <canvas
              ref={dualCanvasRef}
              width={800}
              height={360}
              className="w-full h-full object-contain block"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
              <span className="font-bold text-sky-400">Shorter Wavelength (λ):</span>
              <p className="text-slate-300 leading-relaxed">
                Peaks are crowded closely together. More wave cycles pass a fixed point per second, which means a <strong>higher frequency</strong> (e.g. higher musical pitch, ultraviolet/X-rays).
              </p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
              <span className="font-bold text-sky-400">Longer Wavelength (λ):</span>
              <p className="text-slate-300 leading-relaxed">
                Peaks are widely spaced apart. Fewer wave cycles pass per second, which means a <strong>lower frequency</strong> (e.g. deep bass notes, radio waves).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View Mode 3: Matrix matching Image 4 */}
      {viewMode === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80">
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">
                    Property
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-amber-400 uppercase tracking-wider w-[37.5%] border-l border-slate-800">
                    Amplitude (A)
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-purple-400 uppercase tracking-wider w-[37.5%] border-l border-slate-800">
                    Wavelength (λ)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {amplitudeVsWavelengthData.map((row, idx) => (
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
        </div>
      )}
    </div>
  );
};
