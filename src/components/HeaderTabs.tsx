import React from 'react';

interface HeaderTabsProps {
  activeTab: 'rt' | 'profiles' | 'start';
  onSelectTab: (tab: 'rt' | 'profiles' | 'start') => void;
  activeProfileName: string;
}

export const HeaderTabs: React.FC<HeaderTabsProps> = ({ activeTab, onSelectTab, activeProfileName }) => {
  return (
    <div className="w-full bg-[#18191c] border-b border-[#26272b] px-3 pt-2 pb-1 flex justify-between items-center select-none pt-safe">
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onSelectTab('start')}
          className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider transition ${
            activeTab === 'start' ? 'bg-[#00a3ff] text-white shadow' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          START
        </button>
        <button
          onClick={() => onSelectTab('rt')}
          className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider transition ${
            activeTab === 'rt' ? 'bg-[#00a3ff] text-white shadow' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          RT DATA
        </button>
        <button
          onClick={() => onSelectTab('profiles')}
          className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider transition ${
            activeTab === 'profiles' ? 'bg-[#00a3ff] text-white shadow' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          PROFILES
        </button>
      </div>

      <div className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#222327] border border-[#303136] text-[#00a3ff] truncate max-w-[120px]">
        {activeProfileName}
      </div>
    </div>
  );
};