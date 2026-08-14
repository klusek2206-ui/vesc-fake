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
    <div className="flex flex-col h-[100dvh] bg-[#1a1a1a] text-white pt-[env(safe-area-inset-top,20px)] pb-[env(safe-area-inset-bottom,10px)] justify-between">
      
      {/* Pasek nawigacyjny górny VESC */}
      <div className="flex justify-around items-center py-2 border-b border-[#2d2d2d] text-xs font-black tracking-wider text-gray-400">
        <button className="px-3 py-1">START</button>
        <button className="px-3 py-1 text-[#00A8FF] border-b-2 border-[#00A8FF]">RT DATA</button>
        <button className="px-3 py-1">PROFILES</button>
      </div>

      {/* Przełącznik GPS / Symulacja */}
      <div className="flex justify-end gap-2 px-4 pt-1">
        <button
          onClick={() => telemetry.enableGPS()}
          className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border transition-all ${
            data.isGpsActive ? 'bg-[#00A8FF] text-black border-[#00A8FF]' : 'bg-[#222] text-gray-400 border-[#333]'
          }`}
        >
          🛰️ GPS
        </button>
        <button
          onClick={() => telemetry.enableSimulation()}
          className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border transition-all ${
            !data.isGpsActive ? 'bg-[#00A8FF] text-black border-[#00A8FF]' : 'bg-[#222] text-gray-400 border-[#333]'
          }`}
        >
          ⚡ SYMULACJA
        </button>
      </div>

      {/* Zegary analogowe */}
      <div className="flex flex-col justify-evenly flex-1 px-2 my-auto">
        
        {/* Rząd 1: CURRENT, POWER, DUTY */}
        <div className="relative flex justify-center items-center">
          <div className="w-[31%] z-0 -mr-2">
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
          <div className="w-[31%] z-0 -ml-2">
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

        {/* Rząd 2: Główny SPEED + BATTERY */}
        <div className="relative flex justify-center items-center my-1">
          <div className="w-[70%] max-w-[250px]">
            <AnalogGauge
              title=""
              value={data.speed}
              min={0}
              max={60}
              needleColor="#00A8FF"
              labels={['0', '10', '20', '30', '40', '50', '60']}
              centerOverride={
                <div className="flex flex-col items-center pt-2">
                  <span className="text-[10px] font-black text-gray-400 tracking-widest">SPEED</span>
                  <span className="text-5xl font-black text-white tracking-tighter my-0.5">{data.speed}</span>
                  <span className="text-[10px] font-black text-gray-400 tracking-widest">KM/H</span>
                </div>
              }
            />
          </div>

          {/* Logo VESC w tle */}
          <div className="absolute top-2 right-6 opacity-20 text-xs font-black italic tracking-widest pointer-events-none">
            \VESC®
          </div>

          {/* Nakładający się Zegar Baterii */}
          <div className="absolute right-[5%] bottom-[2%] w-[40%] max-w-[135px] z-10">
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
                  <span className="text-[8px] font-black text-gray-400">BATTERY</span>
                  <span className="text-[10px] font-bold text-white leading-tight">∞ KM RANGE</span>
                  <span className="text-xs font-black text-white">{data.battery}%</span>
                </div>
              }
            />
          </div>
        </div>

        {/* Rząd 3: TEMP ESC, CONSUMP., TEMP MOTOR */}
        <div className="relative flex justify-center items-center">
          <div className="w-[31%] z-0 -mr-2">
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
          <div className="w-[31%] z-0 -ml-2">
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

      {/* Dolny Panel ODOMETER / TRIP / UP-TIME */}
      <div className="px-3 py-1">
        <div className="bg-[#141414] border border-[#2b2b2b] rounded-lg py-1.5 px-2">
          <div className="grid grid-cols-3 text-center text-[9px] font-extrabold text-gray-400 tracking-wider">
            <span>ODOMETER</span>
            <span>TRIP</span>
            <span>UP-TIME</span>
          </div>
          <div className="grid grid-cols-3 text-center font-mono font-black text-base text-gray-100 tracking-widest mt-0.5">
            <span>{data.odometer.toFixed(1)}</span>
            <span>{data.trip.toFixed(1)}</span>
            <span>{formatUptime(data.uptime)}</span>
          </div>
        </div>
      </div>

      {/* Dolna belka systemowa */}
      <div className="flex justify-between items-center bg-[#111111] border-t border-[#262626] px-5 py-2 text-xs font-extrabold text-gray-400">
        <span className="text-gray-300">⚙️</span>
        <span className="text-gray-300">Not connected</span>
        <span className="text-xs">CAN ➔</span>
      </div>
    </div>
  );
};