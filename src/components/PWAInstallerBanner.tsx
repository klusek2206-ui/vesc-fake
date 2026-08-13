import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export const PWAInstallerBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Sprawdź czy jest to Safari na iOS i nie działa jako Standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIos && !isStandalone) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-14 left-3 right-3 bg-[#1c1d22]/95 backdrop-blur-md border border-[#3a3b42] rounded-xl p-3 z-50 text-white shadow-2xl flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-bold text-sm text-[#00a3ff]">Zainstaluj jako aplikację iOS</span>
        <button onClick={() => setShowBanner(false)} className="text-gray-400 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-gray-300">
        Aby ta aplikacja działała na pełnym ekranie bez paska Safari:
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-200">
        1. Kliknij <Share className="w-4 h-4 text-[#00a3ff] inline" /> <strong>Udostępnij</strong>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-200">
        2. Wybierz <PlusSquare className="w-4 h-4 text-[#00a3ff] inline" /> <strong>Dodaj do ekranu początkowego</strong>
      </div>
    </div>
  );
};