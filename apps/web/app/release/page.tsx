"use client";
import { useState, useRef, useEffect } from "react";
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
  const [releasing, setReleasing] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [result, setResult] = useState<{ grade: FrogGrade; lifespan_years: number; reason: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStarField(canvasRef);

  const handleRelease = async () => {
    if (!text.trim() || loading || releasing) return;
    setReleasing(true);

    // 薄くなるアニメーション
    let op = 1;
    const fade = setInterval(() => {
      op -= 0.05;
      setOpacity(op);
      if (op <= 0) clearInterval(fade);
    }, 50);

    const frog = await postFrog(text);
    setTimeout(() => {
      setReleasing(false);
      setOpacity(1);
      setText("");
      if (frog) {
        setResult({ grade: frog.grade, lifespan_years: frog.lifespan_years, reason: frog.reason });
      }
    }, 1200);
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
        gap: 32,
      }}>
        <h1 style={{ color: "#fff", fontSize: 24, margin: 0 }}>放流する</h1>

        {/* カエル + テキスト */}
        <div style={{ position: "relative", opacity, transition: releasing ? "none" : "opacity 0.1s" }}>
          {/* カエル本体 */}
          <div style={{ fontSize: 120, lineHeight: 1, textAlign: "center", userSelect: "none" }}>🐸</div>

          {/* 背中のテキスト */}
          <div style={{
            position: "absolute",
            top: "28%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 100,
            textAlign: "center",
            fontSize: 10,
            color: "rgba(255,255,255,0.9)",
            fontWeight: "bold",
            wordBreak: "break-all",
            lineHeight: 1.3,
            pointerEvents: "none",
            textShadow: "0 0 4px #000",
          }}>
            {text || "　"}
          </div>
        </div>

        {/* テキスト入力 */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="思考を入力..."
          rows={3}
          disabled={releasing}
          style={{
            width: "min(360px, 90vw)",
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
          disabled={loading || releasing}
          style={{
            padding: "12px 32px",
            borderRadius: 8,
            border: "none",
            background: loading || releasing ? "#333" : "#1a6b3a",
            color: "#fff",
            cursor: loading || releasing ? "not-allowed" : "pointer",
            fontSize: 16,
          }}
        >
          {releasing ? "放流中..." : loading ? "評価中..." : "放流する"}
        </button>

        {result && (
          <div style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            textAlign: "center",
            width: "min(360px, 90vw)",
          }}>
            <div style={{ fontSize: 14, color: "#aaa" }}>{GRADE_LABEL[result.grade]} · 寿命 {result.lifespan_years.toLocaleString()}年</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>{result.reason}</div>
          </div>
        )}
      </div>
    </main>
  );
}