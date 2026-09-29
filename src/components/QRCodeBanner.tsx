import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Smartphone, Copy, Check, Share2, Sparkles, Printer } from 'lucide-react';

interface QRCodeBannerProps {
  onOpenModal: () => void;
  onPrintSheet: () => void;
}

export const QRCodeBanner: React.FC<QRCodeBannerProps> = ({ onOpenModal, onPrintSheet }) => {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Interactive Mobile Access</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white max-w-xl" style={{ textWrap: 'balance' }}>
            Interactive Wave Physics Laboratory & Question Bank
          </h1>

          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Scan the QR code with your mobile camera to launch live particle wave simulators, compare mechanical vs. electromagnetic radiation, test vacuum transmission, and challenge the complete question bank.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Link Copied' : 'Copy Direct Link'}</span>
            </button>

            <button
              onClick={onOpenModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-sky-200 bg-sky-900/40 hover:bg-sky-800/50 border border-sky-700/50 rounded-lg transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-sky-400" />
              <span>Customize & Download QR</span>
            </button>

            <button
              onClick={onPrintSheet}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Classroom Handout</span>
            </button>
          </div>
        </div>

        {/* Live Interactive QR Code Tile */}
        <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg border border-slate-200/20 shrink-0">
          <img
            src="/qr_code.png"
            alt="Website QR Code"
            className="w-[140px] h-[140px] object-contain rounded"
          />
          <div className="mt-2 text-center">
            <p className="text-[11px] font-bold text-slate-900 tracking-tight">SCAN FOR LAB</p>
            <p className="text-[9px] text-slate-500 font-mono">Mobile / Tablet Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};
