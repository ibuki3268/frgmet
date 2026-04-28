export type FrogGrade = "dead" | "weak" | "alive" | "immortal";

export type Frog = {
  id: string;
  content: string;
  lifespan_years: number;
  grade: FrogGrade;
  reason: string;
  position: [number, number, number];
  created_at: string;
};