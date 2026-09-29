import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Copy, Check, ExternalLink, Smartphone, Printer, RefreshCw } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrintSheet: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, onPrintSheet }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrColor, setQrColor] = useState<'slate' | 'white' | 'cyan' | 'amber'>('white');
  const [includeMargin, setIncludeMargin] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const colorConfig = {
    white: { fg: '#0f172a', bg: '#ffffff', label: 'Classic Print' },
    slate: { fg: '#38bdf8', bg: '#020617', label: 'Dark Cyan' },
    cyan: { fg: '#0369a1', bg: '#f0f9ff', label: 'Sky Blueprint' },
    amber: { fg: '#b45309', bg: '#fffbeb', label: 'Amber Warm' },
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadPNG = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      if (ctx) {
        ctx.fillStyle = colorConfig[qrColor].bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 600, 600);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'Wave_Physics_Lab_QR.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleDownloadSVG = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'Wave_Physics_Lab_QR.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Website QR Code</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Scan with any smartphone camera or tablet to open this interactive physics lab directly on mobile.
          </p>
        </div>

        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800/80">
          <div
            ref={qrRef}
            className="p-4 rounded-xl shadow-inner transition-colors"
            style={{ backgroundColor: colorConfig[qrColor].bg }}
          >
            <QRCodeSVG
              value={currentUrl || 'https://ais-dev-xn7vlqd2dc3jbnxu5ihyvy-764095025374.europe-west2.run.app'}
              size={220}
              level="H"
              includeMargin={includeMargin}
              fgColor={colorConfig[qrColor].fg}
              bgColor={colorConfig[qrColor].bg}
            />
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span>Point mobile camera at the code to open instantly</span>
          </div>
        </div>

        {/* Color Palette Selector */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">QR Style:</span>
          <div className="flex items-center gap-1.5">
            {(['white', 'slate', 'cyan', 'amber'] as const).map((colorKey) => (
              <button
                key={colorKey}
                onClick={() => setQrColor(colorKey)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  qrColor === colorKey
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 font-medium'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/50'
                }`}
              >
                {colorConfig[colorKey].label}
              </button>
            ))}
          </div>
        </div>

        {/* Target URL field */}
        <div className="mt-4 space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Website URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500"
              placeholder="https://your-site-url..."
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800">
          <a
            href="/qr_code.png"
            download="Wave_Physics_Lab_QR.png"
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-center"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Download PNG</span>
          </a>
          <button
            onClick={handleDownloadSVG}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Download SVG</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onPrintSheet();
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-sky-200 bg-sky-950/70 hover:bg-sky-900/80 border border-sky-800/80 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-sky-300" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
