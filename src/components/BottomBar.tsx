import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

interface BottomBarProps {
  isConnected: boolean;
  onOpenSettings: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ isConnected, onOpenSettings }) => {
  return (
    <footer className="w-full bg-[#18191c] border-t border-[#26272b] h-12 px-3 flex items-center justify-between text-xs text-[#8e8e93] pb-safe">
      <button
        onClick={onOpenSettings}
        className="p-2 text-[#a2a2a8] hover:text-white active:scale-95 transition-transform"
        aria-label="Settings"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 font-medium">
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00e676] shadow-[0_0_6px_#00e676]' : 'bg-[#ff3b30]'}`} />
        <span className="text-[#c7c7cc]">{isConnected ? 'Connected' : 'Not connected'}</span>
      </div>

      <button className="flex items-center gap-1 bg-[#242529] px-2.5 py-1 rounded border border-[#3a3b40] font-semibold text-[#e1e1e3] text-[11px] active:bg-[#2c2d33]">
        CAN <span className="text-[9px]">➔</span>
      </button>
    </footer>
  );
};