import { useRef, useState } from "react";

const MARGIN = { top: 24, right: 24, bottom: 64, left: 40 };
const WIDTH = 640;
const HEIGHT = 480;
const INNER_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

function computeRollingAverages(sortedEntries) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  return sortedEntries.map((entry, index) => {
    const entryTime = new Date(entry.date).getTime();
    const windowStart = entryTime - 6 * DAY_MS;
    let sum = 0;
    let count = 0;
    for (let i = index; i >= 0; i--) {
      const otherTime = new Date(sortedEntries[i].date).getTime();
      if (otherTime < windowStart) break;
      sum += sortedEntries[i].ruminationRating;
      count += 1;
    }
    return { date: entry.date, average: sum / count };
  });
}

export default function RatingScatterChart({ entries, startDate, endDate }) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const minTime = new Date(startDate).getTime();
  const maxTimeRaw = new Date(endDate).getTime();
  const maxTime = maxTimeRaw > minTime ? maxTimeRaw : minTime + 24 * 60 * 60 * 1000;

  function xScale(dateStr) {
    const time = new Date(dateStr).getTime();
    return MARGIN.left + ((time - minTime) / (maxTime - minTime)) * INNER_WIDTH;
  }

  function yScale(rating) {
    return MARGIN.top + INNER_HEIGHT - ((rating - 1) / 9) * INNER_HEIGHT;
  }

  const sortedEntries = entries.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const rollingAverages = computeRollingAverages(sortedEntries);

  const linePath = rollingAverages
    .map((point, i) => `${i === 0 ? "M" : "L"}${xScale(point.date)},${yScale(point.average)}`)
    .join(" ");

  const xTickCount = 6;
  const dateTicks = Array.from({ length: xTickCount + 1 }, (_, i) => {
    const time = minTime + (i / xTickCount) * (maxTime - minTime);
    return new Date(time).toISOString().slice(0, 10);
  });

  function showTooltip(event, entry) {
    const bounds = containerRef.current.getBoundingClientRect();
    setTooltip({
      left: event.clientX - bounds.left + 12,
      top: event.clientY - bounds.top + 12,
      entry,
    });
  }

  return (
    <div className="chart-wrapper" ref={containerRef}>
      <div className="chart-legend">
        <span className="chart-legend__item">
          <svg width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="var(--moss)" />
          </svg>
          Practice completed
        </span>
        <span className="chart-legend__item">
          <svg width="14" height="14" aria-hidden="true">
            <rect x="2.5" y="2.5" width="9" height="9" fill="var(--clay)" transform="rotate(45 7 7)" />
          </svg>
          No practice
        </span>
        <span className="chart-legend__item">
          <svg width="20" height="14" aria-hidden="true">
            <line x1="0" y1="7" x2="20" y2="7" stroke="var(--avg-line)" strokeWidth="2" />
          </svg>
          7-day rolling average
        </span>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="chart-svg" role="img" aria-label="Rumination rating over time">
        {/* gridlines */}
        {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
          <line
            key={`grid-${rating}`}
            x1={MARGIN.left}
            x2={MARGIN.left + INNER_WIDTH}
            y1={yScale(rating)}
            y2={yScale(rating)}
            className="chart-gridline"
          />
        ))}

        {/* y axis (rating) */}
        <line
          x1={MARGIN.left}
          x2={MARGIN.left}
          y1={MARGIN.top}
          y2={MARGIN.top + INNER_HEIGHT}
          className="chart-axis"
        />
        {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
          <text
            key={`ylabel-${rating}`}
            x={MARGIN.left - 10}
            y={yScale(rating) + 4}
            textAnchor="end"
            className="chart-tick-label"
          >
            {rating}
          </text>
        ))}
        <text
          x={-(MARGIN.top + INNER_HEIGHT / 2)}
          y={14}
          textAnchor="middle"
          transform="rotate(-90)"
          className="chart-axis-label"
        >
          Rumination rating
        </text>

        {/* x axis (date) */}
        <line
          x1={MARGIN.left}
          x2={MARGIN.left + INNER_WIDTH}
          y1={MARGIN.top + INNER_HEIGHT}
          y2={MARGIN.top + INNER_HEIGHT}
          className="chart-axis"
        />
        {dateTicks.map((date) => (
          <text
            key={`xlabel-${date}`}
            x={xScale(date)}
            y={MARGIN.top + INNER_HEIGHT + 16}
            textAnchor="end"
            transform={`rotate(-35 ${xScale(date)} ${MARGIN.top + INNER_HEIGHT + 16})`}
            className="chart-tick-label"
          >
            {date}
          </text>
        ))}

        {/* rolling average line */}
        {rollingAverages.length > 1 && <path d={linePath} className="chart-avg-line" />}

        {/* scatter points */}
        {sortedEntries.map((entry) => {
          const cx = xScale(entry.date);
          const cy = yScale(entry.ruminationRating);
          const shared = {
            onMouseEnter: (e) => showTooltip(e, entry),
            onMouseLeave: () => setTooltip(null),
          };
          return entry.practiceCompleted ? (
            <circle
              key={entry.id}
              cx={cx}
              cy={cy}
              r="5"
              className="chart-mark chart-mark--good"
              {...shared}
            />
          ) : (
            <rect
              key={entry.id}
              x={cx - 4.5}
              y={cy - 4.5}
              width="9"
              height="9"
              transform={`rotate(45 ${cx} ${cy})`}
              className="chart-mark chart-mark--orange"
              {...shared}
            />
          );
        })}
      </svg>

      {tooltip && (
        <div className="chart-tooltip" style={{ left: tooltip.left, top: tooltip.top }}>
          <strong>{tooltip.entry.date}</strong>
          <div>Rating {tooltip.entry.ruminationRating}</div>
          <div>{tooltip.entry.practiceCompleted ? "Practice completed" : "No practice"}</div>
        </div>
      )}
    </div>
  );
}
