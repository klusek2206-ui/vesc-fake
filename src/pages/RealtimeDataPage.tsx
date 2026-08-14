import React, { useEffect, useState } from 'react';
import { GPSService, TelemetryData } from '../services/GPSService';

export const RealtimeDataPage: React.FC = () => {
  const [data, setData] = useState<TelemetryData>(GPSService.getSnapshot());

  useEffect(() => {
    const unsubscribe = GPSService.subscribe(setData);
    return () => unsubscribe();
  }, []);

  const formatUptime = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Obliczanie kąta wskazówek (dokładne odwzorowanie podziałek VESC)
  const getAngle = (val: number, min: number, max: number, startAngle: number, endAngle: number) => {
    const clamped = Math.min(Math.max(val, min), max);
    const pct = (clamped - min) / (max - min);
    return startAngle + pct * (endAngle - startAngle);
  };

  // Kąty wskazówek na podstawie zrzutu ekranu:
  const angleCurrent = getAngle(data.current, -60, 60, 90, 270);     // 0 na godz. 9 (z żółtą wskazówką)
  const anglePower = getAngle(data.power, -10000, 10000, -90, 90);   // 0k na godz. 12 (z niebieską wskazówką)
  const angleDuty = getAngle(data.duty, -100, 100, -90, 90);         // 0 na godz. 3 (z fioletową wskazówką)
  const angleSpeed = getAngle(data.speed, 0, 60, 125, -55);          // 0 na godz. 4 (z niebieską wskazówką)
  const angleBattery = getAngle(data.battery, 0, 100, -35, 145);     // 0 na godz. 4 (z czerwoną wskazówką)
  const angleTempEsc = getAngle(data.tempEsc, 0, 100, 130, -35);    // 0 na godz. 5 (z niebieską wskazówką)
  const angleConsump = getAngle(data.consumption, -50, 50, -90, 90); // 0 na godz. 12 (z niebieską wskazówką)
  const angleTempMotor = getAngle(data.tempMotor, 0, 100, 215, 50); // 0 na godz. 7 (z niebieską wskazówką)

  return (
    <div className="flex flex-col h-[100dvh] bg-[#222222] text-white select-none overflow-hidden justify-between font-sans">
      
      {/* Pasek Nawigacji Górnej */}
      <div className="flex justify-around items-center pt-3 pb-1 border-b border-[#333333] text-sm font-extrabold tracking-wider">
        <button className="text-gray-400">START</button>
        <button className="text-[#00A8FF] border-b-2 border-[#00A8FF] pb-0.5">RT DATA</button>
        <button className="text-gray-400">PROFILES</button>
      </div>

      {/* Kontener SVG - Zegary 1:1 ze zdjęcia */}
      <div className="relative flex-1 w-full max-w-[430px] mx-auto my-auto flex items-center justify-center">
        <svg viewBox="0 0 380 560" className="w-full h-full max-h-[82dvh]">
          
          <defs>
            {/* Tło tarcz z delikatnym gładkim gradientem */}
            <radialGradient id="dialGrad" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#111111" />
            </radialGradient>

            {/* Szklana refleksja VESC */}
            <linearGradient id="glassReflect" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.08" />
              <stop offset="40%" stopColor="white" stopOpacity="0.01" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* ==================== RZĄD GÓRNY ==================== */}

          {/* LEWY: CURRENT */}
          <g transform="translate(75, 80)">
            <circle r="60" fill="url(#dialGrad)" stroke="#333" strokeWidth="2" />
            <circle r="60" fill="url(#glassReflect)" />
            {/* Tarcza i kreski */}
            <circle r="56" fill="none" stroke="#222" strokeWidth="1" />
            <text x="0" y="-18" fill="#888" fontSize="8" fontWeight="bold" textAnchor="middle">CURRENT</text>
            <text x="0" y="2" fill="#fff" fontSize="18" fontWeight="900" textAnchor="middle">{data.current}</text>
            <text x="0" y="16" fill="#888" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>
            
            {/* Liczby tarcz */}
            <text x="-44" y="3" fill="#666" fontSize="7" textAnchor="middle">0</text>
            <text x="-38" y="-22" fill="#666" fontSize="6" textAnchor="middle">10</text>
            <text x="-24" y="-38" fill="#666" fontSize="6" textAnchor="middle">20</text>
            <text x="0" y="-45" fill="#666" fontSize="6" textAnchor="middle">30</text>
            <text x="24" y="-38" fill="#666" fontSize="6" textAnchor="middle">40</text>
            <text x="38" y="-22" fill="#666" fontSize="6" textAnchor="middle">50</text>
            <text x="44" y="3" fill="#666" fontSize="6" textAnchor="middle">60</text>
            <text x="-38" y="26" fill="#666" fontSize="6" textAnchor="middle">-10</text>
            <text x="-24" y="40" fill="#666" fontSize="6" textAnchor="middle">-20</text>
            <text x="-3" y="47" fill="#666" fontSize="6" textAnchor="middle">-30</text>
            <text x="18" y="46" fill="#666" fontSize="6" textAnchor="middle">-40</text>
            <text x="34" y="38" fill="#666" fontSize="6" textAnchor="middle">-50</text>
            <text x="44" y="24" fill="#666" fontSize="6" textAnchor="middle">-60</text>

            {/* Żółty trójkątny wskaźnik */}
            <g transform={`rotate(${angleCurrent})`}>
              <polygon points="-52,0 -44,-4 -44,4" fill="#FFE600" />
            </g>
          </g>

          {/* ŚRODKOWY: POWER (NAKŁADA SIĘ NA BOKI) */}
          <g transform="translate(190, 75)">
            <circle r="72" fill="url(#dialGrad)" stroke="#3a3a3a" strokeWidth="2.5" />
            <circle r="72" fill="url(#glassReflect)" />
            <text x="0" y="-22" fill="#aaa" fontSize="9" fontWeight="extrabold" textAnchor="middle">POWER</text>
            <text x="0" y="2" fill="#fff" fontSize="24" fontWeight="900" textAnchor="middle">{data.power}</text>
            <text x="0" y="20" fill="#aaa" fontSize="9" fontWeight="extrabold" textAnchor="middle">W</text>

            <text x="0" y="-56" fill="#888" fontSize="7" fontWeight="bold" textAnchor="middle">0k</text>
            <text x="28" y="-50" fill="#666" fontSize="6" textAnchor="middle">2k</text>
            <text x="48" y="-32" fill="#666" fontSize="6" textAnchor="middle">4k</text>
            <text x="56" y="-8" fill="#666" fontSize="6" textAnchor="middle">6k</text>
            <text x="52" y="18" fill="#666" fontSize="6" textAnchor="middle">8k</text>
            <text x="36" y="42" fill="#666" fontSize="6" textAnchor="middle">10k</text>

            <text x="-28" y="-50" fill="#666" fontSize="6" textAnchor="middle">-2k</text>
            <text x="-48" y="-32" fill="#666" fontSize="6" textAnchor="middle">-4k</text>
            <text x="-56" y="-8" fill="#666" fontSize="6" textAnchor="middle">-6k</text>
            <text x="-52" y="18" fill="#666" fontSize="6" textAnchor="middle">-8k</text>
            <text x="-36" y="42" fill="#666" fontSize="6" textAnchor="middle">-10k</text>

            {/* Jasnoniebieski wskaźnik */}
            <g transform={`rotate(${anglePower})`}>
              <polygon points="0,-64 -4,-55 4,-55" fill="#00A8FF" />
            </g>
          </g>

          {/* PRAWY: DUTY */}
          <g transform="translate(305, 80)">
            <circle r="60" fill="url(#dialGrad)" stroke="#333" strokeWidth="2" />
            <circle r="60" fill="url(#glassReflect)" />
            <text x="0" y="-18" fill="#888" fontSize="8" fontWeight="bold" textAnchor="middle">DUTY</text>
            <text x="0" y="2" fill="#fff" fontSize="18" fontWeight="900" textAnchor="middle">{data.duty}</text>
            <text x="0" y="16" fill="#888" fontSize="8" fontWeight="bold" textAnchor="middle">%</text>

            <text x="44" y="3" fill="#666" fontSize="7" textAnchor="middle">0</text>
            <text x="36" y="-22" fill="#666" fontSize="6" textAnchor="middle">25</text>
            <text x="22" y="-38" fill="#666" fontSize="6" textAnchor="middle">50</text>
            <text x="0" y="-45" fill="#666" fontSize="6" textAnchor="middle">75</text>
            <text x="-24" y="-38" fill="#666" fontSize="6" textAnchor="middle">100</text>
            <text x="34" y="28" fill="#666" fontSize="6" textAnchor="middle">-25</text>
            <text x="20" y="42" fill="#666" fontSize="6" textAnchor="middle">-50</text>
            <text x="-3" y="47" fill="#666" fontSize="6" textAnchor="middle">-75</text>
            <text x="-24" y="40" fill="#666" fontSize="6" textAnchor="middle">-100</text>

            {/* Fioletowa wskazówka */}
            <g transform={`rotate(${angleDuty})`}>
              <polygon points="52,0 44,-4 44,4" fill="#B800FF" />
            </g>
          </g>

          {/* ==================== RZĄD ŚRODKOWY ==================== */}

          {/* LOGO VESC W TLE */}
          <text x="330" y="185" fill="#ffffff" opacity="0.18" fontSize="16" fontWeight="900" fontStyle="italic" textAnchor="end">
            \VESC®
          </text>

          {/* GŁÓWNY ZEGAR: SPEED */}
          <g transform="translate(145, 275)">
            <circle r="115" fill="url(#dialGrad)" stroke="#3a3a3a" strokeWidth="3" />
            <circle r="115" fill="url(#glassReflect)" />
            
            <text x="0" y="-32" fill="#aaa" fontSize="13" fontWeight="900" letterSpacing="1" textAnchor="middle">SPEED</text>
            <text x="0" y="12" fill="#ffffff" fontSize="52" fontWeight="900" textAnchor="middle">{data.speed}</text>
            <text x="0" y="38" fill="#aaa" fontSize="12" fontWeight="900" letterSpacing="1" textAnchor="middle">KM/H</text>

            {/* Liczby tarczy SPEED */}
            <text x="48" y="70" fill="#888" fontSize="13" fontWeight="bold">0</text>
            <text x="-24" y="76" fill="#888" fontSize="13" fontWeight="bold">10</text>
            <text x="-76" y="42" fill="#888" fontSize="13" fontWeight="bold">20</text>
            <text x="-90" y="-10" fill="#888" fontSize="13" fontWeight="bold">30</text>
            <text x="-62" y="-58" fill="#888" fontSize="13" fontWeight="bold">40</text>
            <text x="-8" y="-76" fill="#888" fontSize="13" fontWeight="bold">50</text>
            <text x="52" y="-52" fill="#888" fontSize="13" fontWeight="bold">60</text>

            {/* Zębatka ustawień wewnątrz zegara prędkości */}
            <circle cx="-80" cy="70" r="14" fill="#2a2a2a" stroke="#444" strokeWidth="1.5" />
            <text x="-80" y="74" fill="#aaa" fontSize="12" textAnchor="middle">⚙️</text>

            {/* Niebieski wskaźnik SPEED */}
            <g transform={`rotate(${angleSpeed})`}>
              <polygon points="98,38 86,30 90,44" fill="#00A8FF" />
            </g>
          </g>

          {/* ZEGAR NAKŁADAJĄCY SIĘ: BATTERY */}
          <g transform="translate(300, 275)">
            <circle r="68" fill="url(#dialGrad)" stroke="#3a3a3a" strokeWidth="2" />
            <circle r="68" fill="url(#glassReflect)" />

            <text x="0" y="-22" fill="#aaa" fontSize="8" fontWeight="bold" textAnchor="middle">BATTERY</text>
            <text x="-12" y="-2" fill="#fff" fontSize="22" fontWeight="900" textAnchor="middle">∞</text>
            <text x="18" y="-5" fill="#aaa" fontSize="6" fontWeight="bold">KM RANGE</text>
            <text x="0" y="18" fill="#fff" fontSize="14" fontWeight="900" textAnchor="middle">{data.battery}%</text>

            <text x="48" y="24" fill="#666" fontSize="6" textAnchor="middle">0</text>
            <text x="42" y="42" fill="#666" fontSize="6" textAnchor="middle">10</text>
            <text x="24" y="52" fill="#666" fontSize="6" textAnchor="middle">20</text>
            <text x="0" y="56" fill="#666" fontSize="6" textAnchor="middle">30</text>

            {/* Czerwony wskaźnik Baterii */}
            <g transform={`rotate(${angleBattery})`}>
              <polygon points="56,22 48,16 48,26" fill="#FF2A2A" />
            </g>
          </g>

          {/* Pasek pod Baterią */}
          <g transform="translate(300, 360)">
            <line x1="-40" y1="0" x2="40" y2="0" stroke="#444" strokeWidth="2" />
            <text x="0" y="3" fill="#aaa" fontSize="8" fontWeight="bold" textAnchor="middle">0%</text>
          </g>

          {/* ==================== RZĄD DOLNY ==================== */}

          {/* LEWY: TEMP ESC */}
          <g transform="translate(75, 465)">
            <circle r="60" fill="url(#dialGrad)" stroke="#333" strokeWidth="2" />
            <circle r="60" fill="url(#glassReflect)" />

            <text x="0" y="-20" fill="#888" fontSize="7" fontWeight="bold" textAnchor="middle">TEMP</text>
            <text x="0" y="-11" fill="#888" fontSize="7" fontWeight="bold" textAnchor="middle">ESC</text>
            <text x="0" y="8" fill="#fff" fontSize="18" fontWeight="900" textAnchor="middle">{data.tempEsc}</text>
            <text x="0" y="22" fill="#888" fontSize="8" fontWeight="bold" textAnchor="middle">°C</text>

            <text x="36" y="34" fill="#666" fontSize="6" textAnchor="middle">0</text>
            <text x="-24" y="38" fill="#666" fontSize="6" textAnchor="middle">20</text>
            <text x="-44" y="14" fill="#666" fontSize="6" textAnchor="middle">40</text>
            <text x="-38" y="-18" fill="#666" fontSize="6" textAnchor="middle">60</text>

            {/* Niebieski wskaźnik */}
            <g transform={`rotate(${angleTempEsc})`}>
              <polygon points="44,28 36,22 38,32" fill="#00A8FF" />
            </g>
          </g>

          {/* ŚRODKOWY: CONSUMP. */}
          <g transform="translate(190, 465)">
            <circle r="70" fill="url(#dialGrad)" stroke="#3a3a3a" strokeWidth="2.5" />
            <circle r="70" fill="url(#glassReflect)" />

            <text x="0" y="-22" fill="#aaa" fontSize="8" fontWeight="extrabold" textAnchor="middle">CONSUMP.</text>
            <text x="0" y="2" fill="#fff" fontSize="22" fontWeight="900" textAnchor="middle">{data.consumption}</text>
            <text x="0" y="18" fill="#aaa" fontSize="7" fontWeight="bold" textAnchor="middle">WH/KM</text>
            <text x="0" y="32" fill="#fff" fontSize="14" fontWeight="900" textAnchor="middle">0</text>
            <text x="0" y="44" fill="#777" fontSize="7" fontWeight="bold" textAnchor="middle">AVG</text>

            <text x="0" y="-54" fill="#888" fontSize="6" textAnchor="middle">0</text>
            <text x="28" y="-46" fill="#666" fontSize="6" textAnchor="middle">10</text>
            <text x="48" y="-28" fill="#666" fontSize="6" textAnchor="middle">20</text>
            <text x="-28" y="-46" fill="#666" fontSize="6" textAnchor="middle">-10</text>
            <text x="-48" y="-28" fill="#666" fontSize="6" textAnchor="middle">-20</text>

            {/* Niebieski wskaźnik */}
            <g transform={`rotate(${angleConsump})`}>
              <polygon points="0,-58 -4,-48 4,-48" fill="#00A8FF" />
            </g>
          </g>

          {/* PRAWY: TEMP MOTOR */}
          <g transform="translate(305, 465)">
            <circle r="60" fill="url(#dialGrad)" stroke="#333" strokeWidth="2" />
            <circle r="60" fill="url(#glassReflect)" />

            <text x="0" y="-20" fill="#888" fontSize="7" fontWeight="bold" textAnchor="middle">TEMP</text>
            <text x="0" y="-11" fill="#888" fontSize="7" fontWeight="bold" textAnchor="middle">MOTOR</text>
            <text x="0" y="8" fill="#fff" fontSize="18" fontWeight="900" textAnchor="middle">{data.tempMotor}</text>
            <text x="0" y="22" fill="#888" fontSize="8" fontWeight="bold" textAnchor="middle">°C</text>

            <text x="-36" y="34" fill="#666" fontSize="6" textAnchor="middle">0</text>
            <text x="24" y="38" fill="#666" fontSize="6" textAnchor="middle">20</text>

            {/* Niebieski wskaźnik */}
            <g transform={`rotate(${angleTempMotor})`}>
              <polygon points="-44,28 -36,22 -38,32" fill="#00A8FF" />
            </g>
          </g>

        </svg>
      </div>

      {/* Dolny Panel ODOMETER / TRIP / UP-TIME */}
      <div className="px-4 pb-1">
        <div className="text-center mb-1">
          <div className="grid grid-cols-3 text-[9px] font-black text-gray-400 tracking-widest">
            <span>ODOMETER</span>
            <span>TRIP</span>
            <span>UP-TIME</span>
          </div>
        </div>
        <div className="bg-[#141414] border border-[#333333] rounded-md py-1 px-3">
          <div className="grid grid-cols-3 text-center font-mono font-black text-lg text-gray-200 tracking-wider">
            <span>{data.odometer.toFixed(1)}</span>
            <span>{data.trip.toFixed(1)}</span>
            <span>{formatUptime(data.uptime)}</span>
          </div>
        </div>
      </div>

      {/* Dolny Pasek Statusu VESC Tool */}
      <div className="flex justify-between items-center bg-[#181818] border-t border-[#2a2a2a] px-4 py-2 text-xs font-bold text-gray-400">
        <button className="text-sm">⚙️</button>
        <span className="text-gray-300">Not connected</span>
        <span className="text-xs tracking-wider">CAN ➔</span>
      </div>

    </div>
  );
};