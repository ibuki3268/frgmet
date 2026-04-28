"use client";
import { useState, useRef } from "react";
import { usePostFrog } from "../../hooks/usePostFrogs";
import { useStarField } from "../../hooks/useStarField";
import type { FrogGrade } from "@/types/frog";

const GRADE_LABEL: Record<FrogGrade, string> = {
  dead: "死亡",
  weak: "虚弱",
  alive: "生存",
  immortal: "不滅",
};

export default function ReleasePage() {
  const { postFrog, loading } = usePostFrog();
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ grade: FrogGrade; lifespan_years: number; reason: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStarField(canvasRef);

  const handleRelease = async () => {
    if (!text.trim() || loading) return;
    const frog = await postFrog(text);
    if (frog) {
      setResult({ grade: frog.grade, lifespan_years: frog.lifespan_years, reason: frog.reason });
      setText("");
    }
  };

  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#000", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000 100%)" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
      }}>
        <h1 style={{ color: "#fff", fontSize: 24, margin: 0 }}>放流する</h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="思考をカエルに乗せて放流する..."
          rows={4}
          style={{
            width: "min(480px, 90vw)",
            padding: "12px 14px",
            borderRadius: 8,
            border: "1px solid #444",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: 14,
            outline: "none",
            resize: "none",
          }}
        />

        <button
          onClick={handleRelease}
          disabled={loading}
          style={{
            padding: "12px 32px",
            borderRadius: 8,
            border: "none",
            background: loading ? "#333" : "#1a6b3a",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 16,
          }}
        >
          {loading ? "放流中..." : "放流する"}
        </button>

        {result && (
          <div style={{
            marginTop: 16,
            padding: 20,
            borderRadius: 12,
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            textAlign: "center",
            width: "min(480px, 90vw)",
          }}>
            <div style={{ fontSize: 48 }}>🐸</div>
            <div style={{ fontSize: 20, marginTop: 8 }}>{GRADE_LABEL[result.grade]}</div>
            <div style={{ fontSize: 14, color: "#aaa", marginTop: 4 }}>
              寿命: {result.lifespan_years.toLocaleString()}年
            </div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>{result.reason}</div>
          </div>
        )}
      </div>
    </main>
  );
}