import React from 'react';

interface HeaderTabsProps {
  activeTab: 'START' | 'RT DATA' | 'PROFILES';
  onTabChange: (tab: 'START' | 'RT DATA' | 'PROFILES') => void;
}

export const HeaderTabs: React.FC<HeaderTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="w-full bg-[#121315] pt-safe px-4 border-b border-[#222326] flex flex-col justify-between select-none">
      <div className="flex justify-between items-center h-12">
        {(['START', 'RT DATA', 'PROFILES'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative flex-1 text-center font-bold text-sm tracking-wide transition-colors duration-150 ${
                isActive ? 'text-[#00a3ff]' : 'text-[#7c7c80] hover:text-[#a2a2a8]'
              }`}
            >
              {tab}
              {isActive && (
                <div className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#00a3ff] rounded-t shadow-[0_0_8px_#00a3ff]" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};