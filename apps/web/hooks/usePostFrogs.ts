import { useState } from "react";
import type { Frog } from "@/types/frog";

export function usePostFrog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postFrog = async (content: string): Promise<Frog | null> => {
    if (!content.trim()) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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