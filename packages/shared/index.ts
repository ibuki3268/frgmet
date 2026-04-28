export type FrogGrade = "dead" | "weak" | "alive" | "immortal";

export type Frog = {
  id: string;
  user_id?: string | null;
  content: string;
  lifespan_years: number;
  grade: FrogGrade;
  reason: string;
  position: [number, number, number];
  created_at: string;
};

export type User = {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
};