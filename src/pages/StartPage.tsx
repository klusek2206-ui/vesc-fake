import React, { useState } from 'react';
import { Bluetooth, RefreshCw, CheckCircle2 } from 'lucide-react';
import { FakeVESCService } from '../services/FakeVESCService';
import { VescDevice } from '../types/vesc';

interface StartPageProps {
  onConnected: () => void;
}

export const StartPage: React.FC<StartPageProps> = ({ onConnected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<VescDevice[]>([]);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectedId, setConnectedId] = useState<string | null>(null);

  const handleStartScan = async () => {
    setIsScanning(true);
    setDevices([]);
    const foundDevices = await FakeVESCService.scanForDevices();
    setDevices(foundDevices);
    setIsScanning(false);
  };

  const handleConnect = async (device: VescDevice) => {
    setConnectingId(device.id);
    await FakeVESCService.connectDevice(device.id);
    setConnectingId(null);
    setConnectedId(device.id);

    setTimeout(() => {
      onConnected();
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center bg-[#121315]">
      <div className="w-20 h-20 rounded-full bg-[#1c1d22] border border-[#00a3ff]/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,163,255,0.15)]">
        <Bluetooth className="w-10 h-10 text-[#00a3ff]" />
      </div>

      <h1 className="text-2xl font-bold text-white tracking-wider mb-1">FAKE VESC</h1>
      <p className="text-xs text-[#8e8e93] mb-8">VESC Dashboard & Telemetry Emulator</p>

      {devices.length === 0 && !isScanning && (
        <button
          onClick={handleStartScan}
          className="w-full max-w-xs py-3.5 bg-[#00a3ff] hover:bg-[#008fe0] active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-[#00a3ff]/20 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Bluetooth className="w-4 h-4" /> CONNECT TO VESC
        </button>
      )}

      {isScanning && (
        <div className="flex flex-col items-center gap-3 py-6">
          <RefreshCw className="w-8 h-8 text-[#00a3ff] animate-spin" />
          <span className="text-xs font-semibold text-[#a2a2a8] tracking-widest uppercase">
            Scanning for VESC Devices...
          </span>
        </div>
      )}

      {devices.length > 0 && !isScanning && (
        <div className="w-full max-w-sm flex flex-col gap-2.5 my-2">
          <span className="text-xs text-[#8e8e93] text-left px-1 font-semibold">DISCOVERED DEVICES:</span>
          {devices.map((device) => {
            const isConn = connectingId === device.id;
            const isDone = connectedId === device.id;

            return (
              <div
                key={device.id}
                className="bg-[#1a1b1e] border border-[#2c2d33] rounded-xl p-3.5 flex items-center justify-between text-left shadow-sm"
              >
                <div>
                  <div className="font-semibold text-white text-sm">{device.name}</div>
                  <div className="text-[11px] text-[#8e8e93] flex items-center gap-2 mt-0.5">
                    <span>Signal: <strong className="text-[#00e676]">{device.signal}</strong></span>
                    <span>({device.rssi} dBm)</span>
                  </div>
                </div>

                <button
                  disabled={isConn || isDone}
                  onClick={() => handleConnect(device)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isDone
                      ? 'bg-[#00e676] text-black'
                      : isConn
                      ? 'bg-[#3a3b42] text-gray-300'
                      : 'bg-[#00a3ff] text-white hover:bg-[#008fe0]'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> CONNECTED
                    </>
                  ) : isConn ? (
                    'CONNECTING...'
                  ) : (
                    'CONNECT'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};