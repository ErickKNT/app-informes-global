import React from 'react';
import { cn } from '@/utils/cn';

export interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  className?: string;
  ariaLabel?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'currentColor',
  height = 32,
  width = 160,
  className,
  ariaLabel = 'Gráfico de tendencia histórica',
}) => {
  if (!data || data.length < 2) {
    return null;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Normalizar coordenadas dentro del viewBox
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;
  const stepX = width / (data.length - 1);

  const points = data.map((val, idx) => {
    const x = idx * stepX;
    // Invertir Y porque en SVG 0 está arriba
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const lastPoint = points[points.length - 1]!;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('w-full overflow-hidden select-none', className)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-8 overflow-visible"
      >
        {/* Relleno translúcido debajo de la curva */}
        <path
          d={`${pathD} L ${width},${height} L 0,${height} Z`}
          fill={color}
          fillOpacity={0.12}
        />
        {/* Línea de tendencia principal */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Punto culminante final */}
        <circle cx={lastPoint.x} cy={lastPoint.y} r={3} fill={color} />
      </svg>
    </div>
  );
};

Sparkline.displayName = 'Sparkline';
