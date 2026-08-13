import React from 'react';
import { Profile } from '../types/vesc';
import { ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

interface ProfilesPageProps {
  profiles: Profile[];
  onSelectProfile: (id: string) => void;
}

export const ProfilesPage: React.FC<ProfilesPageProps> = ({ profiles, onSelectProfile }) => {
  return (
    <div className="flex-1 p-4 bg-[#121315] flex flex-col items-center">
      <h2 className="text-sm font-bold text-[#8e8e93] tracking-widest uppercase mb-4">PROFILE PRĘDKOŚCI</h2>

      <div className="w-full max-w-sm space-y-3">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => onSelectProfile(profile.id)}
            className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
              profile.active
                ? 'bg-[#1a2230] border-[#00a3ff] shadow-lg'
                : 'bg-[#18191c] border-[#26272b] opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              {profile.isLegalMode ? (
                <ShieldCheck className={`w-8 h-8 ${profile.active ? 'text-[#00a3ff]' : 'text-[#8e8e93]'}`} />
              ) : (
                <Zap className={`w-8 h-8 ${profile.active ? 'text-[#00a3ff]' : 'text-[#8e8e93]'}`} />
              )}

              <div>
                <div className="text-sm font-bold text-white">{profile.name}</div>
                <div className="text-xs text-[#8e8e93] mt-0.5">
                  Limit: <span className="text-white font-semibold">{profile.maxSpeedLimitKm} km/h</span>
                </div>
              </div>
            </div>

            {profile.active && <CheckCircle2 className="w-6 h-6 text-[#00a3ff]" />}
          </div>
        ))}
      </div>
    </div>
  );
};