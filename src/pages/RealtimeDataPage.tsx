import React, { useEffect, useState } from 'react';
import { telemetry, TelemetryData } from '../services/GPSService';
import { AnalogGauge } from '../components/AnalogGauge';

export const RealtimeDataPage: React.FC = () => {
  const [data, setData] = useState<TelemetryData>({
    speed: 0,
    current: 0,
    power: 0,
    duty: 0,
    battery: 98,
    tempEsc: 32,
    tempMotor: 35,
    consumption: 0,
    odometer: 0,
    trip: 0,
    uptime: 0,
    isGpsActive: false,
  });

  useEffect(() => {
    const unsubscribe = telemetry.subscribe(setData);
    return () => unsubscribe();
  }, []);

  const formatUptime = (sec: number) => {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white overflow-hidden p-2 justify-between">
      {/* Przełącznik źródła prędkości */}
      <div className="flex justify-between items-center px-2 py-1 bg-[#1E1E1E] rounded-md border border-[#2C2C2C] text-xs">
        <span className="text-gray-400 font-medium">Źródło prędkości:</span>
        <div className="flex gap-2">
          <button
            onClick={() => telemetry.enableGPS()}
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              data.isGpsActive ? 'bg-[#00A8FF] text-black' : 'bg-[#2A2A2A] text-gray-400'
            }`}
          >
            🛰️ GPS
          </button>
          <button
            onClick={() => telemetry.enableSimulation()}
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              !data.isGpsActive ? 'bg-[#00A8FF] text-black' : 'bg-[#2A2A2A] text-gray-400'
            }`}
          >
            ⚡ Symulacja
          </button>
        </div>
      </div>

      {/* Górny Rząd 3 Zegarów (CURRENT, POWER, DUTY) */}
      <div className="grid grid-cols-3 gap-1 items-center px-1">
        <AnalogGauge
          title="CURRENT"
          value={data.current}
          unit="A"
          min={-60}
          max={60}
          startAngle={130}
          endAngle={370}
          needleColor="#FFE600"
        />
        <AnalogGauge
          title="POWER"
          value={data.power}
          unit="W"
          min={-10000}
          max={10000}
          startAngle={130}
          endAngle={410}
          needleColor="#00A8FF"
          className="scale-110 z-10"
        />
        <AnalogGauge
          title="DUTY"
          value={data.duty}
          unit="%"
          min={-100}
          max={100}
          startAngle={130}
          endAngle={370}
          needleColor="#B800FF"
        />
      </div>

      {/* Środkowa Sekcja: Główny SPEED + Bateria */}
      <div className="relative my-auto flex items-center justify-center">
        {/* Duży Zegar Prędkości */}
        <div className="w-[72%] max-w-[280px]">
          <AnalogGauge
            title=""
            value={data.speed}
            min={0}
            max={60}
            startAngle={130}
            endAngle={410}
            needleColor="#00A8FF"
            ticksCount={13}
            centerTextOverride={
              <div className="flex flex-col items-center justify-center pt-2">
                <span className="text-[10px] tracking-widest text-gray-400 font-extrabold">SPEED</span>
                <span className="text-5xl font-black text-white tracking-tighter my-1">{data.speed}</span>
                <span className="text-[10px] tracking-widest text-gray-400 font-extrabold">KM/H</span>
              </div>
            }
          />
        </div>

        {/* Logo VESC w tle */}
        <div className="absolute top-2 right-6 opacity-30 text-xs font-black tracking-widest italic pointer-events-none">
          \VESC®
        </div>

        {/* Zegar Baterii (Zachodzący po prawej stronie) */}
        <div className="absolute right-1 bottom-4 w-[42%] max-w-[160px] z-20">
          <AnalogGauge
            title="BATTERY"
            value={data.battery}
            unit="%"
            subValue="∞"
            subLabel="KM RANGE"
            min={0}
            max={100}
            startAngle={130}
            endAngle={370}
            needleColor="#FF2A2A"
          />
        </div>
      </div>

      {/* Dolny Rząd 3 Zegarów (TEMP ESC, CONSUMP, TEMP MOTOR) */}
      <div className="grid grid-cols-3 gap-1 items-center px-1">
        <AnalogGauge
          title="TEMP ESC"
          value={data.tempEsc}
          unit="°C"
          min={0}
          max={100}
          startAngle={130}
          endAngle={370}
          needleColor="#00A8FF"
        />
        <AnalogGauge
          title="CONSUMP."
          value={data.consumption}
          unit="WH/KM"
          subValue="0"
          subLabel="AVG"
          min={-50}
          max={50}
          startAngle={130}
          endAngle={410}
          needleColor="#00A8FF"
          className="scale-110 z-10"
        />
        <AnalogGauge
          title="TEMP MOTOR"
          value={data.tempMotor}
          unit="°C"
          min={0}
          max={100}
          startAngle={130}
          endAngle={370}
          needleColor="#00A8FF"
        />
      </div>

      {/* Dolny Panel Cyfrowy (ODOMETER, TRIP, UP-TIME) */}
      <div className="bg-[#181818] border border-[#282828] rounded-lg p-2 mt-2">
        <div className="grid grid-cols-3 text-center mb-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase">ODOMETER</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase">TRIP</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase">UP-TIME</span>
        </div>
        <div className="grid grid-cols-3 text-center font-mono font-bold text-lg text-gray-200 tracking-wider">
          <div>{data.odometer.toFixed(1)}</div>
          <div>{data.trip.toFixed(1)}</div>
          <div>{formatUptime(data.uptime)}</div>
        </div>
      </div>
    </div>
  );
};