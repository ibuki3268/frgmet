"use client";
import { useState, useRef } from "react";
import { useStarField } from "../../hooks/useStarField";
import type { Frog, FrogGrade } from "@/types/frog";

const GRADE_LABEL: Record<FrogGrade, string> = {
  dead: "死亡",
  weak: "虚弱",
  alive: "生存",
  immortal: "不滅",
};

const GRADE_EMOJI: Record<FrogGrade, string> = {
  dead: "🪦",
  weak: "🐸",
  alive: "🐸",
  immortal: "✨🐸✨",
};

export default function ReceivePage() {
  const [frog, setFrog] = useState<Frog | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStarField(canvasRef);

  const handleReceive = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/frogs?random=true");
      if (!res.ok) throw new Error("失敗");
      const data = await res.json();
      setFrog(data);
    } catch {
      setFrog(null);
    } finally {
      setLoading(false);
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
        gap: 24,
      }}>
        <h1 style={{ color: "#fff", fontSize: 24, margin: 0 }}>受け取る</h1>

        <button
          onClick={handleReceive}
          disabled={loading}
          style={{
            padding: "12px 32px",
            borderRadius: 8,
            border: "none",
            background: loading ? "#333" : "#1a3a6b",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 16,
          }}
        >
          {loading ? "探しています..." : "カエルを受け取る"}
        </button>

        {frog && (
          <div style={{
            padding: 24,
            borderRadius: 12,
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            textAlign: "center",
            width: "min(480px, 90vw)",
          }}>
            <div style={{ fontSize: 56 }}>{GRADE_EMOJI[frog.grade]}</div>
            <div style={{ fontSize: 18, marginTop: 12 }}>{frog.content}</div>
            <div style={{ fontSize: 14, color: "#aaa", marginTop: 8 }}>
              {GRADE_LABEL[frog.grade]} · 寿命 {frog.lifespan_years.toLocaleString()}年
            </div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>{frog.reason}</div>
          </div>
        )}
      </div>
    </main>
  );
}