import React from 'react';

interface GaugeProps {
  title: string;
  unit?: string;
  value: number;
  min: number;
  max: number;
  startAngle: number;
  endAngle: number;
  needleColor?: string;
  subValue?: string;
  subLabel?: string;
  ticksCount?: number;
  className?: string;
  centerTextOverride?: React.ReactNode;
}

export const AnalogGauge: React.FC<GaugeProps> = ({
  title,
  unit = '',
  value,
  min,
  max,
  startAngle,
  endAngle,
  needleColor = '#00A8FF',
  subValue,
  subLabel,
  ticksCount = 11,
  className = '',
  centerTextOverride
}) => {
  const clampVal = Math.min(Math.max(value, min), max);
  const pct = (clampVal - min) / (max - min);
  const currentAngle = startAngle + pct * (endAngle - startAngle);

  // Generowanie podziałek
  const ticks = [];
  for (let i = 0; i < ticksCount; i++) {
    const tickPct = i / (ticksCount - 1);
    const angle = startAngle + tickPct * (endAngle - startAngle);
    const rad = (angle * Math.PI) / 180;
    
    const isMajor = i % 2 === 0;
    const innerR = isMajor ? 38 : 42;
    const outerR = 46;

    const x1 = 50 + innerR * Math.cos(rad);
    const y1 = 50 + innerR * Math.sin(rad);
    const x2 = 50 + outerR * Math.cos(rad);
    const y2 = 50 + outerR * Math.sin(rad);

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#888"
        strokeWidth={isMajor ? 1.2 : 0.6}
      />
    );
  }

  // Wyliczenie pozycji wskazówki
  const needleRad = (currentAngle * Math.PI) / 180;
  const needleX = 50 + 44 * Math.cos(needleRad);
  const needleY = 50 + 44 * Math.sin(needleRad);

  return (
    <div className={`relative aspect-square rounded-full bg-[#161616] border border-[#2A2A2A] shadow-2xl overflow-hidden select-none ${className}`}>
      {/* Metaliczna ramka i refleks światła */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Tarcza zegara */}
        <circle cx="50" cy="50" r="48" fill="#141414" stroke="#222" strokeWidth="2" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="#2D2D2D" strokeWidth="0.5" />

        {/* Podziałki */}
        {ticks}

        {/* Wskazówka */}
        <line
          x1="50"
          y1="50"
          x2={needleX}
          y2={needleY}
          stroke={needleColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Środek wskazówki */}
        <circle cx="50" cy="50" r="3" fill="#000" stroke={needleColor} strokeWidth="1.5" />
      </svg>

      {/* Tekst na środku tarczy */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center pt-2">
        {centerTextOverride ? (
          centerTextOverride
        ) : (
          <>
            <span className="text-[9px] tracking-wider text-gray-400 font-bold uppercase">{title}</span>
            <span className="text-xl font-extrabold text-white leading-none my-0.5">{value}</span>
            {unit && <span className="text-[9px] text-gray-400 font-bold uppercase">{unit}</span>}
            {subValue && (
              <div className="mt-1 flex flex-col items-center">
                <span className="text-xs font-bold text-white">{subValue}</span>
                {subLabel && <span className="text-[7px] text-gray-400 uppercase">{subLabel}</span>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};