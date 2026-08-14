import React, { useEffect, useState } from 'react';
import { telemetry, TelemetryData } from '../services/GPSService';
import { AnalogGauge } from '../components/AnalogGauge';

export const RealtimeDataPage: React.FC = () => {
  const [data, setData] = useState<TelemetryData>(telemetry.getSnapshot());

  useEffect(() => {
    const unsubscribe = telemetry.subscribe(setData);
    return () => unsubscribe();
  }, []);

  const formatUptime = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#222222] text-white select-none overflow-hidden justify-between">
      {/* Pasek Nawigacyjny Górny */}
      <div className="flex justify-around items-center pt-3 pb-2 border-b border-[#333] text-sm font-extrabold text-gray-400">
        <button className="px-3 py-1">START</button>
        <button className="px-3 py-1 text-[#00A8FF] border-b-2 border-[#00A8FF]">RT DATA</button>
        <button className="px-3 py-1">PROFILES</button>
      </div>

      {/* Wybór Trybu GPS / Symulacja */}
      <div className="flex justify-end gap-2 px-4 pt-1">
        <button
          onClick={() => telemetry.enableGPS()}
          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            data.isGpsActive ? 'bg-[#00A8FF] text-black border-[#00A8FF]' : 'bg-[#1A1A1A] text-gray-400 border-[#333]'
          }`}
        >
          🛰️ GPS
        </button>
        <button
          onClick={() => telemetry.enableSimulation()}
          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            !data.isGpsActive ? 'bg-[#00A8FF] text-black border-[#00A8FF]' : 'bg-[#1A1A1A] text-gray-400 border-[#333]'
          }`}
        >
          ⚡ SYMULACJA
        </button>
      </div>

      {/* Główna Zawartość Zegarów */}
      <div className="flex flex-col justify-around h-full px-2 py-1">
        {/* Rząd Górny: CURRENT, POWER, DUTY */}
        <div className="relative flex justify-center items-center h-[26%]">
          <div className="w-[31%] z-0 -mr-3">
            <AnalogGauge
              title="CURRENT"
              unit="A"
              value={data.current}
              min={-60}
              max={60}
              needleColor="#FFE600"
              labels={['-60', '-30', '0', '30', '60']}
            />
          </div>
          <div className="w-[38%] z-10 scale-105">
            <AnalogGauge
              title="POWER"
              unit="W"
              value={data.power}
              min={-10000}
              max={10000}
              needleColor="#00A8FF"
              labels={['-10k', '-5k', '0', '5k', '10k']}
            />
          </div>
          <div className="w-[31%] z-0 -ml-3">
            <AnalogGauge
              title="DUTY"
              unit="%"
              value={data.duty}
              min={-100}
              max={100}
              needleColor="#B800FF"
              labels={['-100', '-50', '0', '50', '100']}
            />
          </div>
        </div>

        {/* Rząd Środkowy: SPEED + BATTERY */}
        <div className="relative flex justify-center items-center h-[38%]">
          <div className="w-[68%] max-w-[240px] z-0">
            <AnalogGauge
              title=""
              value={data.speed}
              min={0}
              max={60}
              needleColor="#00A8FF"
              labels={['0', '10', '20', '30', '40', '50', '60']}
              centerOverride={
                <div className="flex flex-col items-center pt-2">
                  <span className="text-[10px] font-extrabold text-gray-400 tracking-widest">SPEED</span>
                  <span className="text-5xl font-black text-white tracking-tight my-1">{data.speed}</span>
                  <span className="text-[10px] font-extrabold text-gray-400 tracking-widest">KM/H</span>
                </div>
              }
            />
          </div>

          <div className="absolute right-[8%] bottom-[5%] w-[38%] max-w-[130px] z-10">
            <AnalogGauge
              title="BATTERY"
              unit="%"
              value={data.battery}
              min={0}
              max={100}
              needleColor="#FF2A2A"
              labels={['0', '25', '50', '75', '100']}
              centerOverride={
                <div className="flex flex-col items-center pt-1">
                  <span className="text-[8px] font-extrabold text-gray-400">BATTERY</span>
                  <span className="text-xs font-bold text-white leading-tight">∞ KM RANGE</span>
                  <span className="text-sm font-black text-white">{data.battery}%</span>
                </div>
              }
            />
          </div>
        </div>

        {/* Rząd Dolny: TEMP ESC, CONSUMP., TEMP MOTOR */}
        <div className="relative flex justify-center items-center h-[26%]">
          <div className="w-[31%] z-0 -mr-3">
            <AnalogGauge
              title="TEMP ESC"
              unit="°C"
              value={data.tempEsc}
              min={0}
              max={100}
              needleColor="#00A8FF"
              labels={['0', '25', '50', '75', '100']}
            />
          </div>
          <div className="w-[38%] z-10 scale-105">
            <AnalogGauge
              title="CONSUMP."
              unit="WH/KM"
              value={data.consumption}
              min={-50}
              max={50}
              needleColor="#00A8FF"
              labels={['-50', '-25', '0', '25', '50']}
            />
          </div>
          <div className="w-[31%] z-0 -ml-3">
            <AnalogGauge
              title="TEMP MOTOR"
              unit="°C"
              value={data.tempMotor}
              min={0}
              max={100}
              needleColor="#00A8FF"
              labels={['0', '25', '50', '75', '100']}
            />
          </div>
        </div>
      </div>

      {/* Dolna Sekcja Cyfrowa ODOMETER / TRIP / UP-TIME */}
      <div className="px-3 pb-2">
        <div className="bg-[#181818] border border-[#333] rounded-md py-1 px-2">
          <div className="grid grid-cols-3 text-center text-[9px] font-bold text-gray-400">
            <span>ODOMETER</span>
            <span>TRIP</span>
            <span>UP-TIME</span>
          </div>
          <div className="grid grid-cols-3 text-center font-mono font-bold text-base text-gray-200">
            <span>{data.odometer.toFixed(1)}</span>
            <span>{data.trip.toFixed(1)}</span>
            <span>{formatUptime(data.uptime)}</span>
          </div>
        </div>
      </div>

      {/* Dolny Pasek Statusu */}
      <div className="flex justify-between items-center bg-[#1A1A1A] border-t border-[#2D2D2D] px-4 py-2 text-xs text-gray-400 font-bold">
        <span>⚙️</span>
        <span className="text-gray-300">Not connected</span>
        <span className="text-xs">CAN ➔</span>
      </div>
    </div>
  );
};