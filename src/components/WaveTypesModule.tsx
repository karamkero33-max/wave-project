import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Info, ArrowUp, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { waveTypesInfo } from '../data/comparisonData';

export const WaveTypesModule: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'transverse' | 'longitudinal' | 'surface'>('transverse');
  const [isPlaying, setIsPlaying] = useState(true);
  const [frequency, setFrequency] = useState(1.2); // Hz
  const [amplitude, setAmplitude] = useState(35); // pixels
  const [showVectors, setShowVectors] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Animation Loop for the selected wave simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      const t = timeRef.current;

      // Clear Canvas
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, width, height);

      // Draw subtle background grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Central Equilibrium line
      const centerY = height / 2;
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      if (selectedType === 'transverse') {
        // --- 1. TRANSVERSE WAVE (ROPE / SINE) ---
        const wavelength = 180; // px
        const k = (2 * Math.PI) / wavelength;

        // Draw the smooth continuous rope line
        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8'; // sky-400
        ctx.lineWidth = 3;
        for (let x = 0; x <= width; x += 2) {
          const y = centerY + Math.sin(k * x - t) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw discrete particles along the rope
        const particleCount = 28;
        for (let i = 0; i < particleCount; i++) {
          const x = (i / (particleCount - 1)) * (width - 60) + 30;
          const y = centerY + Math.sin(k * x - t) * amplitude;
          const velocityY = -Math.cos(k * x - t) * amplitude; // dy/dt

          // Particle body
          const isSpecial = i === 7 || i === 14 || i === 21;
          ctx.beginPath();
          ctx.arc(x, y, isSpecial ? 6 : 4, 0, Math.PI * 2);
          ctx.fillStyle = isSpecial ? '#f59e0b' : '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Particle Motion Vector (Up / Down)
          if (showVectors && isSpecial) {
            const arrowLen = (velocityY / amplitude) * 22;
            ctx.beginPath();
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + arrowLen);
            ctx.stroke();

            // Arrow head
            ctx.beginPath();
            ctx.fillStyle = '#f59e0b';
            const headSize = 4;
            const sign = arrowLen >= 0 ? 1 : -1;
            ctx.moveTo(x, y + arrowLen);
            ctx.lineTo(x - headSize, y + arrowLen - sign * headSize);
            ctx.lineTo(x + headSize, y + arrowLen - sign * headSize);
            ctx.fill();

            // Motion text
            ctx.fillStyle = '#f59e0b';
            ctx.font = '10px Plus Jakarta Sans, sans-serif';
            ctx.fillText(velocityY > 0 ? 'Down ↓' : 'Up ↑', x - 12, y + arrowLen + (sign * 14));
          }
        }

        // Labels for Crest and Trough
        if (showLabels) {
          // Find first crest position
          // k * x - t = -PI/2 -> k*x = t - PI/2 -> x = (t - PI/2)/k mod wavelength
          let crestPhase = (Math.PI / 2 + t) % (2 * Math.PI);
          if (crestPhase < 0) crestPhase += 2 * Math.PI;
          let crestX = crestPhase / k;
          while (crestX < 80) crestX += wavelength;
          if (crestX < width - 100) {
            const crestY = centerY - amplitude;
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
            ctx.fillText('Crest (Peak)', crestX - 30, crestY - 12);
            ctx.beginPath();
            ctx.arc(crestX, crestY, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }

          // Find trough position
          let troughPhase = (3 * Math.PI / 2 + t) % (2 * Math.PI);
          if (troughPhase < 0) troughPhase += 2 * Math.PI;
          let troughX = troughPhase / k;
          while (troughX < 80) troughX += wavelength;
          if (troughX < width - 100) {
            const troughY = centerY + amplitude;
            ctx.fillStyle = '#a855f7';
            ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
            ctx.fillText('Trough (Dip)', troughX - 30, troughY + 22);
            ctx.beginPath();
            ctx.arc(troughX, troughY, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }

          // Wave propagation arrow (Forward)
          ctx.strokeStyle = '#22c55e';
          ctx.fillStyle = '#22c55e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(width - 150, 24);
          ctx.lineTo(width - 40, 24);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(width - 40, 24);
          ctx.lineTo(width - 50, 19);
          ctx.lineTo(width - 50, 29);
          ctx.fill();
          ctx.font = '11px Plus Jakarta Sans, sans-serif';
          ctx.fillText('Wave energy travels forward →', width - 200, 42);
        }

      } else if (selectedType === 'longitudinal') {
        // --- 2. LONGITUDINAL WAVE (SLINKY SPRING / SOUND AIR MOLECULES) ---
        const wavelength = 180;
        const k = (2 * Math.PI) / wavelength;
        const coilCount = 45;
        const coilWidth = 40;

        // Draw slinky coils
        ctx.strokeStyle = '#818cf8'; // indigo-400
        ctx.lineWidth = 2.5;

        const coilPoints: { x: number; y: number }[] = [];
        for (let i = 0; i <= coilCount; i++) {
          const restX = (i / coilCount) * (width - 80) + 40;
          // Particle displacement along x: dx = A * sin(k * restX - t)
          const dispX = Math.sin(k * restX - t) * (amplitude * 0.7);
          const actualX = restX + dispX;

          coilPoints.push({ x: actualX, y: centerY });
        }

        // Draw spring helix connections
        ctx.beginPath();
        for (let i = 0; i < coilPoints.length; i++) {
          const p = coilPoints[i];
          const topY = centerY - coilWidth / 2;
          const botY = centerY + coilWidth / 2;

          if (i === 0) {
            ctx.moveTo(p.x, centerY);
          } else {
            const prev = coilPoints[i - 1];
            const midX = (prev.x + p.x) / 2;
            const isOdd = i % 2 === 1;
            ctx.quadraticCurveTo(midX, isOdd ? topY : botY, p.x, centerY);
          }
        }
        ctx.stroke();

        // Draw air molecule particles inside the spring to show vibration
        const airParticles = 30;
        for (let j = 0; j < airParticles; j++) {
          const restX = (j / airParticles) * (width - 80) + 40;
          const dispX = Math.sin(k * restX - t) * (amplitude * 0.7);
          const actualX = restX + dispX;
          const isKey = j === 10 || j === 20;

          ctx.beginPath();
          ctx.arc(actualX, centerY + 28, isKey ? 5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = isKey ? '#f59e0b' : '#a5b4fc';
          ctx.fill();

          // Horizontal Motion vector
          if (showVectors && isKey) {
            const velX = -Math.cos(k * restX - t) * 16;
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(actualX, centerY + 28);
            ctx.lineTo(actualX + velX, centerY + 28);
            ctx.stroke();
          }
        }

        if (showLabels) {
          // Highlight Compression & Rarefaction zones
          // Compression occurs where derivative d(dispX)/dx < 0 -> k*cos(k*x - t) is max negative -> phase = PI
          let compPhase = (Math.PI + t) % (2 * Math.PI);
          if (compPhase < 0) compPhase += 2 * Math.PI;
          let compX = compPhase / k;
          while (compX < 80) compX += wavelength;
          if (compX < width - 120) {
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
            ctx.fillText('▼ Compression (High Density)', compX - 60, centerY - 32);
          }

          let rarePhase = t % (2 * Math.PI);
          if (rarePhase < 0) rarePhase += 2 * Math.PI;
          let rareX = rarePhase / k;
          while (rareX < 80) rareX += wavelength;
          if (rareX < width - 120) {
            ctx.fillStyle = '#c084fc';
            ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
            ctx.fillText('▼ Rarefaction (Spread Out)', rareX - 60, centerY - 32);
          }

          // Forward wave direction
          ctx.fillStyle = '#22c55e';
          ctx.font = '11px Plus Jakarta Sans, sans-serif';
          ctx.fillText('Back & forth particle motion → Energy travels forward →', 30, 24);
        }

      } else if (selectedType === 'surface') {
        // --- 3. SURFACE WAVE (WATER CIRCULAR ORBITAL MOTION) ---
        const wavelength = 190;
        const k = (2 * Math.PI) / wavelength;

        // Draw water background fill
        ctx.beginPath();
        for (let x = 0; x <= width; x += 3) {
          const surfaceY = centerY - 15 + Math.sin(k * x - t) * (amplitude * 0.85);
          if (x === 0) ctx.moveTo(x, surfaceY);
          else ctx.lineTo(x, surfaceY);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        ctx.fill();

        // Draw surface water wave line
        ctx.beginPath();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        for (let x = 0; x <= width; x += 3) {
          const surfaceY = centerY - 15 + Math.sin(k * x - t) * (amplitude * 0.85);
          if (x === 0) ctx.moveTo(x, surfaceY);
          else ctx.lineTo(x, surfaceY);
        }
        ctx.stroke();

        // Draw orbital particle circles at 3 distinct columns
        const sampleXs = [width * 0.25, width * 0.5, width * 0.75];
        sampleXs.forEach((baseX, idx) => {
          // Depths: surface, medium, deep
          [0, 35, 70].forEach((depthOffset) => {
            const decay = Math.exp(-depthOffset / 45); // circular radius decays with depth
            const r = amplitude * 0.75 * decay;
            const orbCenterY = centerY - 15 + depthOffset;

            // Orbit path circle
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.setLineDash([2, 3]);
            ctx.arc(baseX, orbCenterY, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Particle position on orbit: retrograde circular
            // x = baseX - r * cos(k * baseX - t)
            // y = orbCenterY + r * sin(k * baseX - t)
            const px = baseX - r * Math.cos(k * baseX - t);
            const py = orbCenterY + r * Math.sin(k * baseX - t);

            ctx.beginPath();
            ctx.arc(px, py, depthOffset === 0 ? 5 : 3.5, 0, Math.PI * 2);
            ctx.fillStyle = depthOffset === 0 ? '#38bdf8' : '#7dd3fc';
            ctx.fill();

            // Tangent velocity vector on surface particle
            if (showVectors && depthOffset === 0) {
              const vx = -r * Math.sin(k * baseX - t) * 0.6;
              const vy = -r * Math.cos(k * baseX - t) * 0.6;
              ctx.strokeStyle = '#f59e0b';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(px + vx, py + vy);
              ctx.stroke();
            }
          });

          // Draw yellow buoy/duck floating on water
          if (idx === 1) {
            const r = amplitude * 0.75;
            const buoyX = baseX - r * Math.cos(k * baseX - t);
            const buoyY = (centerY - 15) + r * Math.sin(k * baseX - t);

            // Floating object body
            ctx.beginPath();
            ctx.arc(buoyX, buoyY - 6, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#eab308'; // yellow
            ctx.fill();
            ctx.strokeStyle = '#713f12';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Label
            ctx.fillStyle = '#fde047';
            ctx.font = '10px Plus Jakarta Sans, sans-serif';
            ctx.fillText('Floating Buoy (Bobs in circle, does not travel)', buoyX - 90, buoyY - 20);
          }
        });

        if (showLabels) {
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
          ctx.fillText('Circular / Elliptical Orbital Motion (Motion decreases with depth)', 30, 24);
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [selectedType, isPlaying, frequency, amplitude, showVectors, showLabels]);

  const currentInfo = waveTypesInfo.find((w) => w.id === selectedType) || waveTypesInfo[0];

  return (
    <div className="space-y-6">
      {/* Principle Callout Banner */}
      <div className="flex items-center gap-3 p-4 bg-sky-950/40 border border-sky-800/60 rounded-xl">
        <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
        <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
          <strong className="text-sky-300 font-semibold">Fundamental Physics Principle:</strong> Waves transfer{' '}
          <span className="underline decoration-sky-400 font-bold">ENERGY</span>, not matter! They move disturbances through space without permanently displacing the medium.
        </p>
      </div>

      {/* Main Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Zone: Live Simulation Canvas Stage */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            {/* Interactive Type Selector (Button tabs) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => setSelectedType('transverse')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedType === 'transverse'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Transverse Wave
              </button>
              <button
                onClick={() => setSelectedType('longitudinal')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedType === 'longitudinal'
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Longitudinal Wave
              </button>
              <button
                onClick={() => setSelectedType('surface')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedType === 'surface'
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Surface Wave
              </button>
            </div>

            {/* Playback & View Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  isPlaying ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={() => {
                  timeRef.current = 0;
                }}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Reset simulation time"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Display */}
          <div className="relative w-full aspect-[16/9] max-h-[360px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80">
            <canvas
              ref={canvasRef}
              width={760}
              height={360}
              className="w-full h-full object-contain block"
            />
          </div>

          {/* Controls Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-slate-400">
                <span>Frequency:</span>
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.1"
                  value={frequency}
                  onChange={(e) => setFrequency(parseFloat(e.target.value))}
                  className="w-24 accent-sky-500 cursor-pointer"
                />
                <span className="font-mono text-slate-200 w-10 text-right">{frequency.toFixed(1)} Hz</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-400">
                <span>Amplitude:</span>
                <input
                  type="range"
                  min="15"
                  max="55"
                  step="1"
                  value={amplitude}
                  onChange={(e) => setAmplitude(parseInt(e.target.value))}
                  className="w-24 accent-sky-500 cursor-pointer"
                />
                <span className="font-mono text-slate-200 w-10 text-right">{amplitude} px</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showVectors}
                  onChange={(e) => setShowVectors(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-0 accent-sky-500"
                />
                <span>Motion Vectors</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-0 accent-sky-500"
                />
                <span>Labels</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Zone: Concept Deck & Physical Explanation */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
              Classroom Reference Notes
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {currentInfo.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {currentInfo.subtitle}
            </p>

            <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-slate-200">Particle vs Wave Motion:</div>
              <p className="leading-relaxed text-sky-200">
                {currentInfo.motion}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold text-slate-300">Key Features:</div>
              <ul className="space-y-1.5">
                {currentInfo.keyFeatures.map((feat, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-sky-400 font-bold">·</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-300 mb-2">Real-World Examples:</div>
            <div className="flex flex-wrap gap-1.5">
              {currentInfo.examples.map((ex, i) => (
                <span
                  key={i}
                  className="text-xs text-slate-300 bg-slate-800/80 px-2 py-1 rounded"
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3-Card Visual Summary Grid matching Image 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div
          onClick={() => setSelectedType('transverse')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedType === 'transverse'
              ? 'bg-sky-950/40 border-sky-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400">1. TRANSVERSE WAVE</span>
            <span className="text-[10px] text-slate-400">Up & Down</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Particles move <strong>up and down</strong> while the wave travels forward.
          </p>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2">
            <span>Crest (High)</span>
            <span aria-hidden="true">·</span>
            <span>Trough (Low)</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedType('longitudinal')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedType === 'longitudinal'
              ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400">2. LONGITUDINAL WAVE</span>
            <span className="text-[10px] text-slate-400">Back & Forth</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Particles move <strong>back and forth</strong> in the same direction as wave propagation.
          </p>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2">
            <span>Compression</span>
            <span aria-hidden="true">·</span>
            <span>Rarefaction</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedType('surface')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedType === 'surface'
              ? 'bg-teal-950/40 border-teal-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-400">3. SURFACE WAVE</span>
            <span className="text-[10px] text-slate-400">Orbital Mix</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            A mix of transverse and longitudinal circular motion at a fluid surface.
          </p>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2">
            <span>Ocean Swell</span>
            <span aria-hidden="true">·</span>
            <span>Energy transfers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
