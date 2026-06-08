export type ScoreInputs = {
  adherenceRate: number | null;
  waterGlasses: number;
  sleepHours: number;
  mood: number | null;
  loggedToday: boolean;
};

export type ScorePart = {
  key: 'med' | 'water' | 'sleep' | 'mood' | 'log';
  got: number;
  max: number;
};

export function calculateHealthScore(i: ScoreInputs): { score: number; parts: ScorePart[] } {
  const adherence = i.adherenceRate === null ? 1 : Math.min(1, Math.max(0, i.adherenceRate));
  const med = adherence * 35;
  const water = Math.min(1, Math.max(0, i.waterGlasses) / 8) * 20;
  const sleepIdeal = i.sleepHours >= 7 && i.sleepHours <= 9 ? 1 : Math.max(0, 1 - Math.abs(8 - i.sleepHours) / 8);
  const sleep = sleepIdeal * 20;
  const mood = i.mood != null ? (Math.min(5, Math.max(1, i.mood)) / 5) * 15 : 0;
  const log = i.loggedToday ? 10 : 0;
  const parts: ScorePart[] = [
    { key: 'med', got: Math.round(med), max: 35 },
    { key: 'water', got: Math.round(water), max: 20 },
    { key: 'sleep', got: Math.round(sleep), max: 20 },
    { key: 'mood', got: Math.round(mood), max: 15 },
    { key: 'log', got: Math.round(log), max: 10 },
  ];
  const total = Math.round(med + water + sleep + mood + log);
  return { score: Math.min(100, Math.max(0, total)), parts };
}

export function scoreColor(score: number) {
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#EAB308';
  return '#EF4444';
}
