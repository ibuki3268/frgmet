"use client";

import { useState, useRef } from "react";
import { useRealtimeFrogs } from "../../hooks/useRealtimeFrogs";
import { usePostFrog } from "../../hooks/usePostFrogs";
import { useStarField } from "../../hooks/useStarField";
import type { Frog, FrogGrade } from "@/types/frog";

const GRADE_STYLE: Record<FrogGrade, { emoji: string; size: number; opacity: number }> = {
  dead:     { emoji: "🪦", size: 20, opacity: 0.4 },
  weak:     { emoji: "🐸", size: 28, opacity: 0.7 },
  alive:    { emoji: "🐸", size: 36, opacity: 1.0 },
  immortal: { emoji: "✨🐸✨", size: 48, opacity: 1.0 },
};

function FrogSprite({ frog }: { frog: Frog }) {
  const style = GRADE_STYLE[frog.grade];
  const left = `${((frog.position[0] + 30) / 60) * 100}%`;
  const top  = `${((frog.position[1] + 15) / 30) * 100}%`;

  return (
    <div
      title={`${frog.content}\n寿命: ${frog.lifespan_years.toLocaleString()}年`}
      style={{
        position: "absolute",
        left,
        top,
        fontSize: style.size,
        opacity: style.opacity,
        cursor: "pointer",
        userSelect: "none",
        transform: "translate(-50%, -50%)",
        animation: "float 6s ease-in-out infinite",
        animationDelay: `${Math.random() * 6}s`,
      }}
    >
      {style.emoji}
    </div>
  );
}

export default function Home() {
  const frogs = useRealtimeFrogs();
  const { postFrog, loading, error } = usePostFrog();
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStarField(canvasRef);

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;
    await postFrog(text);
    setText("");
  };

  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#000", position: "relative" }}>
      {/* 宇宙背景グラデーション */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000 100%)" }} />

      {/* 星Canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* カエルたち */}
      {frogs.map((frog) => (
        <FrogSprite key={frog.id} frog={frog} />
      ))}

      {/* 投稿フォーム */}
      <div style={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 8,
        width: "min(480px, 90vw)",
      }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="思考をカエルに乗せて放流する..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #444",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            background: loading ? "#333" : "#1a6b3a",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 14,
          }}
        >
          {loading ? "..." : "放流"}
        </button>
      </div>

      {error && (
        <div style={{ position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)", color: "#f66", fontSize: 13 }}>
          {error}
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50%       { transform: translate(-50%, -50%) translateY(-10px); }
        }
      `}</style>
    </main>
  );
}