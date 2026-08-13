import React from 'react';

interface AnalogGaugeProps {
  title: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  majorTicks: number[];
  subTicksCount?: number;
  needleAngleStart?: number;
  needleAngleEnd?: number;
  needleColor?: string;
  secondaryText?: string;
  secondarySubtext?: string;
  showZeroMarker?: boolean;
  zeroMarkerColor?: string;
  size?: number;
  className?: string;
}

export const AnalogGauge: React.FC<AnalogGaugeProps> = ({
  title,
  value,
  unit,
  min,
  max,
  majorTicks,
  subTicksCount = 4,
  needleAngleStart = 135,
  needleAngleEnd = 405,
  needleColor = '#00a3ff',
  secondaryText,
  secondarySubtext,
  showZeroMarker = false,
  zeroMarkerColor = '#e2b000',
  size = 200,
  className = ''
}) => {
  const center = 100;
  const radius = 82;
  const innerRadius = 72;

  const clampedVal = Math.min(Math.max(value, min), max);
  const valRatio = (clampedVal - min) / (max - min);
  const needleAngle = needleAngleStart + valRatio * (needleAngleEnd - needleAngleStart);

  const ticks: React.ReactNode[] = [];
  const totalMajor = majorTicks.length;

  majorTicks.forEach((tickVal, index) => {
    const tickRatio = (tickVal - min) / (max - min);
    const angle = needleAngleStart + tickRatio * (needleAngleEnd - needleAngleStart);
    const rad = (angle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(rad);
    const y1 = center + radius * Math.sin(rad);
    const x2 = center + innerRadius * Math.cos(rad);
    const y2 = center + innerRadius * Math.sin(rad);

    const labelRadius = innerRadius - 11;
    const lx = center + labelRadius * Math.cos(rad);
    const ly = center + labelRadius * Math.sin(rad);

    ticks.push(
      <line
        key={`major-${index}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#8e8e93"
        strokeWidth="1.6"
      />
    );

    ticks.push(
      <text
        key={`label-${index}`}
        x={lx}
        y={ly}
        fill="#a2a2a8"
        fontSize="8.5"
        fontWeight="500"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {tickVal}
      </text>
    );

    if (index < totalMajor - 1) {
      const nextVal = majorTicks[index + 1];
      const step = (nextVal - tickVal) / (subTicksCount + 1);
      for (let j = 1; j <= subTicksCount; j++) {
        const subVal = tickVal + step * j;
        const subRatio = (subVal - min) / (max - min);
        const subAngle = needleAngleStart + subRatio * (needleAngleEnd - needleAngleStart);
        const subRad = (subAngle * Math.PI) / 180;

        const sx1 = center + radius * Math.cos(subRad);
        const sy1 = center + radius * Math.sin(subRad);
        const sx2 = center + (radius - 5) * Math.cos(subRad);
        const sy2 = center + (radius - 5) * Math.sin(subRad);

        ticks.push(
          <line
            key={`sub-${index}-${j}`}
            x1={sx1}
            y1={sy1}
            x2={sx2}
            y2={sy2}
            stroke="#48484a"
            strokeWidth="0.9"
          />
        );
      }
    }
  });

  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLen = innerRadius - 6;
  const nx = center + needleLen * Math.cos(needleRad);
  const ny = center + needleLen * Math.sin(needleRad);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
        <defs>
          <radialGradient id={`bgGlow-${title}`} cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#1a1b1e" />
            <stop offset="100%" stopColor="#121315" />
          </radialGradient>
          <linearGradient id="glassGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.01" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <circle cx={center} cy={center} r="96" fill={`url(#bgGlow-${title})`} stroke="#2c2c2e" strokeWidth="2.5" />
        <circle cx={center} cy={center} r="94" fill="none" stroke="#161719" strokeWidth="1" />

        {ticks}

        {showZeroMarker && (
          <path
            d={`M ${center - radius} ${center} L ${center - innerRadius + 4} ${center}`}
            stroke={zeroMarkerColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        <text x={center} y={center - 22} fill="#8e8e93" fontSize="8" fontWeight="600" textAnchor="middle" letterSpacing="0.5">
          {title}
        </text>
        <text x={center} y={center + 2} fill="#ffffff" fontSize="22" fontWeight="700" textAnchor="middle">
          {value}
        </text>
        <text x={center} y={center + 18} fill="#8e8e93" fontSize="8" fontWeight="500" textAnchor="middle">
          {unit}
        </text>

        {secondaryText && (
          <text x={center} y={center + 30} fill="#8e8e93" fontSize="7" fontWeight="400" textAnchor="middle">
            {secondaryText}
          </text>
        )}
        {secondarySubtext && (
          <text x={center} y={center + 38} fill="#8e8e93" fontSize="7" fontWeight="400" textAnchor="middle">
            {secondarySubtext}
          </text>
        )}

        <g style={{ transition: 'transform 0.15s ease-out' }}>
          <line
            x1={center}
            y1={center}
            x2={nx}
            y2={ny}
            stroke={needleColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            className="drop-shadow-[0_0_6px_rgba(0,163,255,0.8)]"
          />
          <circle cx={center} cy={center} r="4" fill="#ffffff" stroke={needleColor} strokeWidth="1.5" />
        </g>

        <circle cx={center} cy={center} r="94" fill="url(#glassGloss)" pointerEvents="none" />
      </svg>
    </div>
  );
};