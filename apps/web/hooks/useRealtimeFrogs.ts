import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Frog } from "@/types/frog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useRealtimeFrogs(initialFrogs: Frog[] = []) {
  const [frogs, setFrogs] = useState<Frog[]>(initialFrogs);

  useEffect(() => {
    // 既存カエルを取得
    supabase
      .from("frogs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) {
          const mapped = data.map((row) => ({
            id: row.id,
            content: row.content,
            lifespan_years: row.lifespan_years,
            grade: row.grade,
            reason: row.reason,
            position: [row.pos_x, row.pos_y, row.pos_z] as [number, number, number],
            created_at: row.created_at,
          }));
          setFrogs(mapped);
        }
      });

    // INSERT をリアルタイム購読
    const channel = supabase
      .channel("frogs-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "frogs" },
        (payload) => {
          const row = payload.new;
          const newFrog: Frog = {
            id: row.id,
            content: row.content,
            lifespan_years: row.lifespan_years,
            grade: row.grade,
            reason: row.reason,
            position: [row.pos_x, row.pos_y, row.pos_z],
            created_at: row.created_at,
          };
          setFrogs((prev) => [newFrog, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return frogs;
}