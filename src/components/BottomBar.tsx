import React from 'react';
import { Gauge, Sliders, Play } from 'lucide-react';

interface BottomBarProps {
  activeTab: 'rt' | 'profiles' | 'start';
  onSelectTab: (tab: 'rt' | 'profiles' | 'start') => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <div className="w-full bg-[#16171a] border-t border-[#26272b] flex justify-around items-center py-2 pb-safe select-none">
      <button
        onClick={() => onSelectTab('start')}
        className={`flex flex-col items-center space-y-1 ${activeTab === 'start' ? 'text-[#00a3ff]' : 'text-[#7c7c80]'}`}
      >
        <Play className="w-5 h-5" />
        <span className="text-[9px] font-bold tracking-widest">START</span>
      </button>

      <button
        onClick={() => onSelectTab('rt')}
        className={`flex flex-col items-center space-y-1 ${activeTab === 'rt' ? 'text-[#00a3ff]' : 'text-[#7c7c80]'}`}
      >
        <Gauge className="w-5 h-5" />
        <span className="text-[9px] font-bold tracking-widest">RT DATA</span>
      </button>

      <button
        onClick={() => onSelectTab('profiles')}
        className={`flex flex-col items-center space-y-1 ${activeTab === 'profiles' ? 'text-[#00a3ff]' : 'text-[#7c7c80]'}`}
      >
        <Sliders className="w-5 h-5" />
        <span className="text-[9px] font-bold tracking-widest">PROFILES</span>
      </button>
    </div>
  );
};