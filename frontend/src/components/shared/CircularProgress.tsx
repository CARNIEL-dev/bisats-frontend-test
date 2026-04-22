const CircularProgress = ({ percent }: { percent: number }) => {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(percent, 0), 100);
  const offset = circ * (1 - clamped / 100);

  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="5"
      />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="#22c55e"
        strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset 0.7s ease" }}
      />
      <text
        x="36"
        y="41"
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize="13"
        fontWeight="bold"
      >
        {Math.round(clamped)}%
      </text>
    </svg>
  );
};

export default CircularProgress;
