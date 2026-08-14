import React from 'react';

interface GaugeProps {
  title: string;
  unit?: string;
  value: number;
  min: number;
  max: number;
  startAngle?: number;
  endAngle?: number;
  needleColor?: string;
  labels?: string[];
  className?: string;
  centerOverride?: React.ReactNode;
}

export const AnalogGauge: React.FC<GaugeProps> = ({
  title,
  unit = '',
  value,
  min,
  max,
  startAngle = 130,
  endAngle = 410,
  needleColor = '#00A8FF',
  labels = [],
  className = '',
  centerOverride,
}) => {
  const clampVal = Math.min(Math.max(value, min), max);
  const pct = (clampVal - min) / (max - min);
  const currentAngle = startAngle + pct * (endAngle - startAngle);

  // Podziałki
  const totalTicks = 41;
  const ticks = [];
  for (let i = 0; i < totalTicks; i++) {
    const tPct = i / (totalTicks - 1);
    const angle = startAngle + tPct * (endAngle - startAngle);
    const rad = (angle * Math.PI) / 180;

    const isMajor = i % 4 === 0;
    const innerR = isMajor ? 36 : 40;
    const outerR = 45;

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
        stroke={isMajor ? '#999' : '#444'}
        strokeWidth={isMajor ? '1.2' : '0.6'}
      />
    );
  }

  // Liczby na tarczy
  const labelElements = [];
  if (labels.length > 0) {
    for (let i = 0; i < labels.length; i++) {
      const lPct = i / (labels.length - 1);
      const angle = startAngle + lPct * (endAngle - startAngle);
      const rad = (angle * Math.PI) / 180;
      const textR = 27;

      const lx = 50 + textR * Math.cos(rad);
      const ly = 50 + textR * Math.sin(rad) + 1.2;

      labelElements.push(
        <text
          key={i}
          x={lx}
          y={ly}
          fill="#777"
          fontSize="4.2"
          fontWeight="800"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {labels[i]}
        </text>
      );
    }
  }

  return (
    <div className={`relative aspect-square rounded-full bg-[#181818] border border-[#2e2e2e] shadow-2xl overflow-hidden ${className}`}>
      {/* Efekt szkła/refleks świetlny */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-full pointer-events-none" />

      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#121212" stroke="#222" strokeWidth="1.5" />
        {ticks}
        {labelElements}

        {/* Trójkątny wskaźnik pozycji VESC */}
        <g transform={`rotate(${currentAngle}, 50, 50)`}>
          <polygon points="50,5.5 46.5,12 53.5,12" fill={needleColor} />
        </g>
      </svg>

      {/* Środek zegara */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none pt-0.5">
        {centerOverride ? (
          centerOverride
        ) : (
          <>
            <span className="text-[8px] font-black text-gray-400 tracking-wider uppercase">{title}</span>
            <span className="text-base font-black text-white leading-none my-0.5">{value}</span>
            {unit && <span className="text-[8px] font-bold text-gray-400 uppercase">{unit}</span>}
          </>
        )}
      </div>
    </div>
  );
};