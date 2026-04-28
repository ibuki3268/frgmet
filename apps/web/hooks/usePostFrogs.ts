import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Frog } from "@/types/frog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function usePostFrog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postFrog = async (content: string): Promise<Frog | null> => {
    if (!content.trim()) return null;
    setLoading(true);
    setError(null);
    try {
      const { data: session } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (session?.session?.access_token) {
        headers["Authorization"] = `Bearer ${session.session.access_token}`;
      }

      const res = await fetch("/api/post", {
        method: "POST",
        headers,
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("投稿に失敗しました");
      return await res.json();
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラー");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postFrog, loading, error };
}