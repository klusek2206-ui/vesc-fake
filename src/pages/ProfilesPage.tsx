import React from 'react';

export const ProfilesPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-black tracking-wider text-[#00A8FF] mb-4 uppercase">Profile VESC</h2>
      
      <div className="space-y-3">
        <div className="bg-[#222] border border-[#333] rounded-lg p-3 flex justify-between items-center">
          <div>
            <div className="font-bold text-sm text-white">PROFILE 1: NORMAL</div>
            <div className="text-xs text-gray-400">Max Speed: 25 km/h | Power: 500W</div>
          </div>
          <span className="text-xs font-bold bg-[#00A8FF]/20 text-[#00A8FF] px-2.5 py-1 rounded">ACTIVE</span>
        </div>

        <div className="bg-[#222] border border-[#333] rounded-lg p-3 flex justify-between items-center opacity-70">
          <div>
            <div className="font-bold text-sm text-white">PROFILE 2: SPORT / UNLIMITED</div>
            <div className="text-xs text-gray-400">Max Speed: 60 km/h | Power: 3000W</div>
          </div>
          <button className="text-xs font-bold bg-[#333] text-gray-300 px-2.5 py-1 rounded">SELECT</button>
        </div>

        <div className="bg-[#222] border border-[#333] rounded-lg p-3 flex justify-between items-center opacity-70">
          <div>
            <div className="font-bold text-sm text-white">PROFILE 3: ECO</div>
            <div className="text-xs text-gray-400">Max Speed: 15 km/h | Power: 250W</div>
          </div>
          <button className="text-xs font-bold bg-[#333] text-gray-300 px-2.5 py-1 rounded">SELECT</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilesPage;