import React from 'react';
import { TelemetryData } from '../types/vesc';
import { AnalogGauge } from '../components/AnalogGauge';
import { formatTime } from '../utils/formatters';
import { Settings as SettingsIcon } from 'lucide-react';

interface RealtimeDataPageProps {
  data: TelemetryData;
  onOpenSettings: () => void;
}

export const RealtimeDataPage: React.FC<RealtimeDataPageProps> = ({ data, onOpenSettings }) => {
  return (
    <div className="flex-1 flex flex-col justify-between items-center px-2 py-1 select-none overflow-hidden bg-[#121315]">
      
      {/* GÓRNY RZĄD: CURRENT | POWER | DUTY */}
      <div className="w-full flex justify-between items-center gap-1 max-w-sm mt-1">
        <AnalogGauge
          title="CURRENT"
          value={data.current}
          unit="A"
          min={-60}
          max={60}
          majorTicks={[-60, -40, -20, 0, 20, 40, 60]}
          subTicksCount={1}
          needleAngleStart={135}
          needleAngleEnd={405}
          showZeroMarker={true}
          size={112}
        />

        <AnalogGauge
          title="POWER"
          value={data.power}
          unit="W"
          min={-10000}
          max={10000}
          majorTicks={[-10, -5, 0, 5, 10]}
          needleAngleStart={135}
          needleAngleEnd={405}
          needleColor="#00a3ff"
          size={120}
        />

        <AnalogGauge
          title="DUTY"
          value={data.duty}
          unit="%"
          min={-100}
          max={100}
          majorTicks={[-100, -50, 0, 50, 100]}
          needleAngleStart={135}
          needleAngleEnd={405}
          needleColor="#8a2be2"
          size={112}
        />
      </div>

      {/* ŚRODKOWA SEKCJA: SPEEDOMETER + BATTERY */}
      <div className="relative w-full max-w-sm flex justify-center items-center my-1">
        <div className="relative flex items-center justify-center">
          <AnalogGauge
            title="SPEED"
            value={data.displaySpeed}
            unit="KM/H"
            min={0}
            max={60}
            majorTicks={[0, 10, 20, 30, 40, 50, 60]}
            subTicksCount={4}
            needleAngleStart={135}
            needleAngleEnd={385}
            needleColor="#00a3ff"
            size={220}
          />

          <div className="absolute top-10 right-10 opacity-40 pointer-events-none">
            <span className="text-white font-black italic tracking-tighter text-xs">|||VESC®</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="absolute bottom-5 left-4 p-2 bg-[#222327] border border-[#3a3b40] rounded-full text-[#a2a2a8] hover:text-white shadow-md active:scale-95"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute right-[-6px] top-[18px]">
          <AnalogGauge
            title="BATTERY"
            value={data.batteryPercent}
            unit="%"
            min={0}
            max={100}
            majorTicks={[0, 20, 40, 60, 80, 100]}
            subTicksCount={1}
            needleAngleStart={135}
            needleAngleEnd={385}
            needleColor="#ff3b30"
            secondaryText={`${data.batteryRangeKm} KM RANGE`}
            size={135}
          />
        </div>
      </div>

      {/* DOLNY RZĄD: TEMP ESC | CONSUMPT. | TEMP MOTOR */}
      <div className="w-full flex justify-between items-center gap-1 max-w-sm my-1">
        <AnalogGauge
          title="TEMP ESC"
          value={data.tempEsc}
          unit="°C"
          min={0}
          max={100}
          majorTicks={[0, 20, 40, 60, 80, 100]}
          needleAngleStart={135}
          needleAngleEnd={385}
          needleColor="#00a3ff"
          size={110}
        />

        <AnalogGauge
          title="CONSUMPT."
          value={data.consumption}
          unit="WH/KM"
          min={-50}
          max={50}
          majorTicks={[-50, -25, 0, 25, 50]}
          needleAngleStart={135}
          needleAngleEnd={405}
          needleColor="#00a3ff"
          secondaryText={`${data.consumptionAvg}`}
          secondarySubtext="AVG"
          size={118}
        />

        <AnalogGauge
          title="TEMP MOTOR"
          value={data.tempMotor}
          unit="°C"
          min={0}
          max={100}
          majorTicks={[0, 20, 40, 60, 80, 100]}
          needleAngleStart={135}
          needleAngleEnd={385}
          needleColor="#00a3ff"
          size={110}
        />
      </div>

      {/* STATYSTYKI NA DOLE */}
      <div className="w-full max-w-sm bg-[#16171a] border border-[#26272b] rounded-xl px-4 py-2 flex justify-between items-center text-center shadow-inner mb-1">
        <div>
          <div className="text-[9px] font-bold text-[#7c7c80] tracking-wider uppercase">ODOMETER</div>
          <div className="text-sm font-mono font-bold text-white tracking-widest mt-0.5">
            {data.odometer.toFixed(1)}
          </div>
        </div>

        <div className="h-6 w-[1px] bg-[#2a2b30]" />

        <div>
          <div className="text-[9px] font-bold text-[#7c7c80] tracking-wider uppercase">TRIP</div>
          <div className="text-sm font-mono font-bold text-white tracking-widest mt-0.5">
            {data.trip.toFixed(1)}
          </div>
        </div>

        <div className="h-6 w-[1px] bg-[#2a2b30]" />

        <div>
          <div className="text-[9px] font-bold text-[#7c7c80] tracking-wider uppercase">UP-TIME</div>
          <div className="text-sm font-mono font-bold text-white tracking-widest mt-0.5">
            {formatTime(data.uptimeSeconds)}
          </div>
        </div>
      </div>

    </div>
  );
};