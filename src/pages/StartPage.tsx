import React from 'react';
import { Play, Shield, Zap } from 'lucide-react';

interface StartPageProps {
  onStartClick: () => void;
  activeProfileName: string;
}

export const StartPage: React.FC<StartPageProps> = ({ onStartClick, activeProfileName }) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 text-center bg-[#121315]">
      <div className="w-20 h-20 rounded-full bg-[#1e2025] border border-[#2e313a] flex items-center justify-center mb-6 shadow-2xl">
        <Zap className="w-10 h-10 text-[#00a3ff]" />
      </div>

      <h1 className="text-2xl font-black italic tracking-wider text-white mb-2">VESC TELEMETRY</h1>
      <p className="text-xs text-[#8e8e93] max-w-xs mb-8">
        Tryb symulacji telemetrycznej oparty na GPS z ogranicznikiem trybu Legal Mode.
      </p>

      <div className="mb-8 p-3 bg-[#18191c] border border-[#282a30] rounded-xl w-full max-w-xs">
        <div className="text-[10px] text-[#7c7c80] uppercase tracking-wider font-bold mb-1">Aktywny Profil</div>
        <div className="text-sm font-bold text-[#00a3ff] flex items-center justify-center space-x-1">
          <Shield className="w-4 h-4" />
          <span>{activeProfileName}</span>
        </div>
      </div>

      <button
        onClick={onStartClick}
        className="w-full max-w-xs py-4 bg-[#00a3ff] hover:bg-[#008fdf] text-white font-black tracking-widest rounded-xl shadow-lg active:scale-95 transition flex items-center justify-center space-x-2"
      >
        <Play className="w-5 h-5 fill-current" />
        <span>URUCHOM ZEGAR</span>
      </button>
    </div>
  );
};