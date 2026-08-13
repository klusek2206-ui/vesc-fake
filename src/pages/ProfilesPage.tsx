import React, { useState } from 'react';
import { Profile } from '../types/vesc';
import { StorageService } from '../services/StorageService';
import { Check } from 'lucide-react';

export const ProfilesPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(StorageService.getProfiles());
  const [activeId, setActiveId] = useState<string>(StorageService.getActiveProfileId());

  const handleSelect = (id: string) => {
    setActiveId(id);
    StorageService.setActiveProfileId(id);
  };

  const handleUpdateCurrent = (id: string, val: number) => {
    const updated = profiles.map(p => p.id === id ? { ...p, maxCurrentA: val } : p);
    setProfiles(updated);
    StorageService.saveProfiles(updated);
  };

  return (
    <div className="flex-1 px-4 py-4 overflow-y-auto bg-[#121315]">
      <h2 className="text-base font-bold text-white mb-3">VESC SPEED & POWER PROFILES</h2>

      <div className="flex flex-col gap-3">
        {profiles.map((p) => {
          const isActive = p.id === activeId;
          return (
            <div
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1c1d22] border-[#00a3ff] shadow-[0_0_15px_rgba(0,163,255,0.15)]'
                  : 'bg-[#16171a] border-[#28292e] hover:border-[#38393e]'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white text-sm">{p.name}</span>
                {isActive && (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#00a3ff]">
                    <Check className="w-4 h-4" /> ACTIVE
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#8e8e93] mt-2">
                <div>Max Speed: <strong className="text-white">{p.maxSpeedKmH} km/h</strong></div>
                <div>Max Current: <strong className="text-white">{p.maxCurrentA} A</strong></div>
                <div>Wheel Size: <strong className="text-white">{p.wheelSizeMm} mm</strong></div>
                <div>Speed Multiplier: <strong className="text-white">{p.speedMultiplier}x</strong></div>
              </div>

              {isActive && (
                <div className="mt-3 pt-3 border-t border-[#2a2b30] flex flex-col gap-1">
                  <label className="text-[11px] text-[#a2a2a8]">Adjust Max Current (A): {p.maxCurrentA}A</label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={p.maxCurrentA}
                    onChange={(e) => handleUpdateCurrent(p.id, parseInt(e.target.value))}
                    className="w-full accent-[#00a3ff]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};