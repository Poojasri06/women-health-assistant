import React from "react";

const PHASES = [
  { key: "menstrual", label: "Menstrual", color: "#E8336F" },
  { key: "follicular", label: "Follicular", color: "#C690D6" },
  { key: "ovulation", label: "Ovulation", color: "#F45D93" },
  { key: "luteal", label: "Luteal", color: "#7C3AA8" },
];

// Approximate proportion of a typical cycle each phase occupies, used only
// for the visual arc widths (not for any prediction math).
const PHASE_SPAN = { menstrual: 5, follicular: 9, ovulation: 3, luteal: 11 };

export default function CyclePhaseWheel({ activePhase, dayInCycle, cycleLength }) {
  const total = Object.values(PHASE_SPAN).reduce((a, b) => a + b, 0);
  const radius = 80;
  const stroke = 18;
  const circumference = 2 * Math.PI * radius;

  let offsetAccum = 0;
  const arcs = PHASES.map((phase) => {
    const span = PHASE_SPAN[phase.key];
    const dash = (span / total) * circumference;
    const gap = circumference - dash;
    const rotation = (offsetAccum / total) * 360;
    offsetAccum += span;
    return { ...phase, dash, gap, rotation };
  });

  const progress = cycleLength ? Math.min(dayInCycle / cycleLength, 1) : 0;
  const needleAngle = progress * 360 - 90;

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label={`Cycle wheel, currently in ${activePhase} phase`}>
        <g transform="translate(100,100)">
          <circle r={radius} fill="none" stroke="currentColor" className="text-plum-50 dark:text-plum-800" strokeWidth={stroke} />
          {arcs.map((arc) => (
            <circle
              key={arc.key}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={stroke}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              transform={`rotate(${arc.rotation - 90})`}
              opacity={arc.key === activePhase ? 1 : 0.35}
              strokeLinecap="butt"
            />
          ))}
          {/* Progress needle */}
          <line
            x1="0" y1="0"
            x2={Math.cos((needleAngle * Math.PI) / 180) * (radius - stroke / 2 - 2)}
            y2={Math.sin((needleAngle * Math.PI) / 180) * (radius - stroke / 2 - 2)}
            stroke="#241823"
            className="dark:stroke-blush-50"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle r="5" fill="#241823" className="dark:fill-blush-50" />
          <text textAnchor="middle" dy="-4" className="fill-ink-900 dark:fill-blush-50" style={{ fontFamily: "Fraunces, serif", fontSize: "22px" }}>
            Day {dayInCycle ?? "–"}
          </text>
          <text textAnchor="middle" dy="18" className="fill-plum-400" style={{ fontSize: "11px" }}>
            of ~{cycleLength ?? "–"} days
          </text>
        </g>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
        {PHASES.map((p) => (
          <span key={p.key} className="flex items-center gap-1.5 text-xs text-plum-600 dark:text-plum-200">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
