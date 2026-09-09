import React from 'react';
import { BarChart3, Users, Award } from 'lucide-react';

export interface MonthlyComparativeData {
  month: string;
  publishersHours: number;
  pioneersHours: number;
  isProjected?: boolean;
}

export interface HistoricalComparativeChartProps {
  data?: MonthlyComparativeData[];
  highestVolumeMonth?: string;
  pioneersSharePct?: number;
  punctualityRatePct?: number;
}

const DEFAULT_MONTHS_DATA: MonthlyComparativeData[] = [
  { month: 'Mayo', publishersHours: 1100, pioneersHours: 1400 },
  { month: 'Junio', publishersHours: 1020, pioneersHours: 1350 },
  { month: 'Julio', publishersHours: 1180, pioneersHours: 1520 },
  { month: 'Agosto', publishersHours: 1280, pioneersHours: 1600 },
  { month: 'Septiembre', publishersHours: 1150, pioneersHours: 1480 },
  { month: 'Octubre*', publishersHours: 1200, pioneersHours: 1540, isProjected: true },
];

export const HistoricalComparativeChart: React.FC<HistoricalComparativeChartProps> = ({
  data = DEFAULT_MONTHS_DATA,
  highestVolumeMonth = 'Agosto 2024 (2,680 hrs)',
  pioneersSharePct = 54.8,
  punctualityRatePct = 96.3,
}) => {
  // Chart calculation: max Y scale is 3,000 hrs
  const chartHeight = 160;
  const chartWidth = 640;
  const maxHours = 3000;

  // Compute points for the total trendline
  const stepX = chartWidth / (data.length + 1);
  const points = data.map((item, index) => {
    const total = item.publishersHours + item.pioneersHours;
    const x = Math.round((index + 1) * stepX);
    // Y: 0 is at chartHeight (bottom), maxHours is at 20 (top)
    const y = Math.round(chartHeight - (total / maxHours) * (chartHeight - 30));
    return { x, y, total, ...item };
  });


  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/60 shadow-sm flex flex-col gap-6">
      {/* Header with Title and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-secondary font-bold">
            Dinámica Histórica
          </span>
          <h2 className="font-headline text-xl font-extrabold text-on-surface">
            Evolución Mensual de Horas y Participación
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-primary inline-block" />
            <span className="text-on-surface-variant font-medium">Publicadores</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-secondary inline-block" />
            <span className="text-on-surface-variant font-medium">Precursores</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-amber-500 inline-block" />
            <span className="text-on-surface-variant font-medium">Total Acumulado</span>
          </div>
        </div>
      </div>

      {/* SVG Responsive Chart */}
      <div className="w-full bg-surface-container-low/40 rounded-xl p-4 overflow-x-auto">
        <div className="min-w-[560px]">
          <svg
            className="w-full h-52"
            viewBox={`0 0 ${chartWidth + 60} 220`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Gráfica de evolución mensual de horas y participación"
          >
            {/* Guidelines */}
            <line
              x1="45"
              y1="30"
              x2={chartWidth + 40}
              y2="30"
              stroke="#CBD5E1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <line
              x1="45"
              y1="75"
              x2={chartWidth + 40}
              y2="75"
              stroke="#CBD5E1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <line
              x1="45"
              y1="125"
              x2={chartWidth + 40}
              y2="125"
              stroke="#CBD5E1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <line
              x1="45"
              y1="175"
              x2={chartWidth + 40}
              y2="175"
              stroke="#CBD5E1"
              strokeWidth="1.2"
            />

            {/* Y Axis Labels */}
            <text x="10" y="34" fill="#757682" fontSize="10" fontFamily="Inter">
              2,800
            </text>
            <text x="10" y="79" fill="#757682" fontSize="10" fontFamily="Inter">
              1,900
            </text>
            <text x="10" y="129" fill="#757682" fontSize="10" fontFamily="Inter">
              1,000
            </text>
            <text x="15" y="179" fill="#757682" fontSize="10" fontFamily="Inter">
              0
            </text>

            {/* Bars & Labels */}
            {points.map((pt) => {
              const pubHeight = Math.round((pt.publishersHours / maxHours) * 140);
              const pioHeight = Math.round((pt.pioneersHours / maxHours) * 140);
              const barWidth = 16;
              const barSpacing = 4;
              const xStart = pt.x + 30 - barWidth - barSpacing / 2;

              return (
                <g key={pt.month}>
                  {/* Publicadores Bar */}
                  <rect
                    x={xStart}
                    y={175 - pubHeight}
                    width={barWidth}
                    height={pubHeight}
                    rx="3"
                    className="fill-primary transition-all duration-300 hover:opacity-80"
                  >
                    <title>{`${pt.month} Publicadores: ${pt.publishersHours} hrs`}</title>
                  </rect>

                  {/* Precursores Bar */}
                  <rect
                    x={xStart + barWidth + barSpacing}
                    y={175 - pioHeight}
                    width={barWidth}
                    height={pioHeight}
                    rx="3"
                    className="fill-secondary transition-all duration-300 hover:opacity-80"
                  >
                    <title>{`${pt.month} Precursores: ${pt.pioneersHours} hrs`}</title>
                  </rect>

                  {/* Month Text */}
                  <text
                    x={pt.x + 30}
                    y="196"
                    fill="#444651"
                    fontSize="11"
                    fontFamily="Inter"
                    textAnchor="middle"
                    fontWeight={pt.isProjected ? '600' : 'normal'}
                  >
                    {pt.month}
                  </text>
                </g>
              );
            })}

            {/* Trendline over Total */}
            {points.length > 1 && (
              <>
                <path
                  d={points.reduce(
                    (acc, pt, i) =>
                      i === 0
                        ? `M ${pt.x + 30} ${pt.y}`
                        : `${acc} L ${pt.x + 30} ${pt.y}`,
                    ''
                  )}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {points.map((pt) => (
                  <circle
                    key={`circle-${pt.month}`}
                    cx={pt.x + 30}
                    cy={pt.y}
                    r="4"
                    fill="#F59E0B"
                    className="transition-transform hover:scale-125"
                  >
                    <title>{`${pt.month} Total: ${pt.total} hrs`}</title>
                  </circle>
                ))}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Metadata Highlights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-on-surface-variant font-medium">
              Mes con mayor volumen
            </span>
            <span className="text-xs font-bold text-on-surface">{highestVolumeMonth}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-on-surface-variant font-medium">
              Participación de precursores
            </span>
            <span className="text-xs font-bold text-on-surface">
              {pioneersSharePct}% del total congregacional
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-xs">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-on-surface-variant font-medium">
              Índice de puntualidad en informes
            </span>
            <span className="text-xs font-bold text-on-surface">
              {punctualityRatePct}% entregados a tiempo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

HistoricalComparativeChart.displayName = 'HistoricalComparativeChart';
