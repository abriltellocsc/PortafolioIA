import type { PieLabelRenderProps } from 'recharts';

const LABEL_FILL = '#111827';
const LABEL_STROKE = '#ffffff';
const LABEL_STROKE_WIDTH_PRIMARY = 2.5;
const LABEL_STROKE_WIDTH_SECONDARY = 2;

const labelTextProps = {
  fill: LABEL_FILL,
  paintOrder: 'stroke' as const,
  stroke: LABEL_STROKE,
};

/** Etiquetas de torta legibles sobre cualquier color de segmento */
export function renderPieChartSliceLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  value,
}: PieLabelRenderProps) {
  if (
    midAngle === undefined ||
    name === undefined ||
    cx === undefined ||
    cy === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const numValue = typeof value === 'number' ? value : parseFloat(String(value));
  const displayValue = Number.isFinite(numValue) ? numValue.toFixed(1) : String(value);
  const shortName = String(name).length > 15 ? String(name).substring(0, 12) + '...' : String(name);
  const showFullLabel = Number.isFinite(numValue) && numValue > 5;
  const anchor = x > cx ? 'start' : 'end';

  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
        strokeWidth={LABEL_STROKE_WIDTH_PRIMARY}
        {...labelTextProps}
      >
        {showFullLabel ? shortName : `${displayValue}%`}
      </text>
      {showFullLabel && (
        <text
          x={x}
          y={y + 16}
          textAnchor={anchor}
          dominantBaseline="central"
          fontSize="13"
          fontWeight="600"
          strokeWidth={LABEL_STROKE_WIDTH_SECONDARY}
          {...labelTextProps}
        >
          {displayValue}%
        </text>
      )}
    </g>
  );
}
