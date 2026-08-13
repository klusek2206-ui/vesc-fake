import React, { useState, useEffect } from 'react';

export const PWAInstallerBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (!isStandalone) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="bg-[#212328] border-b border-[#32353e] px-3 py-1.5 flex justify-between items-center text-[11px] text-[#a0a5b5]">
      <span>Dodaj do ekranu głównego (Safari ➔ Udostępnij ➔ Do ekranu początkowego)</span>
      <button onClick={() => setShow(false)} className="text-white font-bold ml-2">✕</button>
    </div>
  );
};