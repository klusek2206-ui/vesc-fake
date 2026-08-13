import React, { useState } from 'react';
import { Settings } from '../types/vesc';
import { StorageService } from '../services/StorageService';
import { X, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (newSettings: Settings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [speedOffset, setSpeedOffset] = useState(settings.speedOffset);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = { ...settings, speedOffset };
    StorageService.saveSettings(updated);
    onSave(updated);
    onClose();
  };

  const handleResetTrip = () => {
    StorageService.resetTrip();
    alert('TRIP meter has been reset.');
  };

  const handleResetOdo = () => {
    if (confirm('Are you sure you want to reset ODOMETER?')) {
      StorageService.resetOdometer();
      alert('ODOMETER has been reset.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#18191c] border border-[#2e2f35] rounded-2xl w-full max-w-sm p-5 text-white shadow-2xl flex flex-col gap-4">
        
        <div className="flex justify-between items-center border-b border-[#28292e] pb-3">
          <h3 className="font-bold text-base">SETTINGS & CONFIGURATION</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SPEED OFFSET */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#8e8e93]">
            SPEED OFFSET (+KM/H ADDED TO REAL GPS): <strong className="text-[#00a3ff]">+{speedOffset} km/h</strong>
          </label>
          <div className="flex gap-2">
            {[10, 15, 20, 25, 30].map((val) => (
              <button
                key={val}
                onClick={() => setSpeedOffset(val)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                  speedOffset === val
                    ? 'bg-[#00a3ff] border-[#00a3ff] text-white'
                    : 'bg-[#222328] border-[#323338] text-[#a2a2a8]'
                }`}
              >
                +{val}
              </button>
            ))}
          </div>
        </div>

        {/* RESETY DATA */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#28292e]">
          <span className="text-xs font-semibold text-[#8e8e93]">DATA MANAGEMENT</span>
          <div className="flex gap-2">
            <button
              onClick={handleResetTrip}
              className="flex-1 py-2 bg-[#26272c] border border-[#383940] rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:bg-[#2e2f36]"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Trip
            </button>
            <button
              onClick={handleResetOdo}
              className="flex-1 py-2 bg-[#26272c] border border-[#383940] rounded-xl text-xs font-semibold text-red-400 flex items-center justify-center gap-1 hover:bg-[#2e2f36]"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Odo
            </button>
          </div>
        </div>

        {/* INFO PWA */}
        <div className="text-[11px] text-[#7c7c80] bg-[#121315] p-3 rounded-xl border border-[#222326]">
          <div>Version: <strong>1.0.0 (PWA)</strong></div>
          <div>GPS Status: <strong className="text-[#00e676]">Active (Smoothed)</strong></div>
          <div>Target Platform: <strong>iOS Safari / Standalone PWA</strong></div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#00a3ff] font-bold text-sm rounded-xl text-white shadow-lg active:scale-95 transition-transform mt-1"
        >
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
};