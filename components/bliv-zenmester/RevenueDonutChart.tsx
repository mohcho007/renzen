type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type RevenueDonutChartProps = {
  segments: DonutSegment[];
  size?: number;
};

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

export function RevenueDonutChart({
  segments,
  size = 280,
}: RevenueDonutChartProps) {
  const strokeWidth = 42;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="Fordeling af omsætning: 70% til Zenmester, 20% til admin, 10% til marketing, salg og tech"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#e8ebe4"
            strokeWidth={strokeWidth}
          />
          {segments.map((segment) => {
            const sweep = (segment.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sweep;
            currentAngle = endAngle;

            if (segment.value === total) {
              return (
                <circle
                  key={segment.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                />
              );
            }

            return (
              <path
                key={segment.label}
                d={describeArc(center, center, radius, startAngle, endAngle)}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c]">
            70%
          </span>
          <span className="mt-1 max-w-[120px] text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7a72]">
            til Zenmester
          </span>
        </div>
      </div>

      <ul className="space-y-4">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <div>
              <p className="font-display text-lg font-semibold text-[#173c2c]">
                {segment.value}%
              </p>
              <p className="text-sm font-medium text-[#536159]">
                {segment.label}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
