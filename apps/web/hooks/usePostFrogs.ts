import { useState } from "react";

export function usePostFrog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postFrog = async (content: string) => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("投稿に失敗しました");
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラー");
    } finally {
      setLoading(false);
    }
  };

  return { postFrog, loading, error };
}