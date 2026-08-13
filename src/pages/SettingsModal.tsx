import React, { useState } from 'react';
import { AppSettings } from '../types/vesc';
import { X } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [form, setForm] = useState<AppSettings>({ ...settings });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-[#18191c] border border-[#2a2b30] w-full max-w-sm rounded-2xl p-5 shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-[#2a2b30] pb-3">
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">USTAWIENIA POJAZDU</h3>
          <button onClick={onClose} className="text-[#8e8e93] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[#8e8e93] mb-1">Średnica koła (mm)</label>
            <input
              type="number"
              value={form.wheelDiameterMm}
              onChange={(e) => setForm({ ...form, wheelDiameterMm: Number(e.target.value) })}
              className="w-full bg-[#121315] border border-[#2c2d33] rounded-lg p-2.5 text-white font-mono focus:border-[#00a3ff] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#8e8e93] mb-1">Napięcie baterii (V)</label>
            <input
              type="number"
              value={form.batteryVolts}
              onChange={(e) => setForm({ ...form, batteryVolts: Number(e.target.value) })}
              className="w-full bg-[#121315] border border-[#2c2d33] rounded-lg p-2.5 text-white font-mono focus:border-[#00a3ff] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#8e8e93] mb-1">Maksymalny prąd (A)</label>
            <input
              type="number"
              value={form.maxCurrentA}
              onChange={(e) => setForm({ ...form, maxCurrentA: Number(e.target.value) })}
              className="w-full bg-[#121315] border border-[#2c2d33] rounded-lg p-2.5 text-white font-mono focus:border-[#00a3ff] outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#222327] text-[#8e8e93] font-bold rounded-xl"
          >
            ANULUJ
          </button>
          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="flex-1 py-2.5 bg-[#00a3ff] text-white font-bold rounded-xl shadow-lg"
          >
            ZAPISZ
          </button>
        </div>
      </div>
    </div>
  );
};