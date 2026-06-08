import { motion } from "framer-motion";
import { scoreColor } from "@/lib/healthScore";

export function HealthScoreRing({ score, label }: { score: number; label: string }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative grid place-items-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} stroke="currentColor" strokeWidth="12" fill="none" className="text-muted/40" />
        <motion.circle
          cx="70" cy="70" r={r} stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round"
          className="text-primary"
          initial={{ strokeDasharray: c, strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className={`text-4xl font-extrabold ${scoreColor(score)}`}>{score}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}
