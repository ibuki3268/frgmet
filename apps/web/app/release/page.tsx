"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePostFrog } from "../../hooks/usePostFrogs";
import { useStarField } from "../../hooks/useStarField";
import { useAuth } from "../../hooks/useAuth";
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
        gap: 24,
      }}>
        <h1 style={{ color: "#fff", fontSize: 24, margin: 0 }}>放流する</h1>

        <div style={{ position: "relative", width: 220, height: 220, opacity, transition: releasing ? "none" : "opacity 0.1s" }}>
          <div style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            transform: "translateY(18px)",
            zIndex: 4,
            pointerEvents: "none",
          }}>
            <div style={{ fontSize: 120, lineHeight: 1, textAlign: "center", userSelect: "none" }}>🐸</div>
          </div>

          <div style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%) rotate(-4deg)",
            width: 118,
            zIndex: 2,
          }}>
            <div style={{
              position: "absolute",
              inset: -4,
              borderRadius: 16,
              background: "rgba(0,0,0,0.28)",
              filter: "blur(10px)",
              transform: "translateY(8px)",
            }} />
            <div style={{
              position: "relative",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "linear-gradient(180deg, rgba(246,255,226,0.94) 0%, rgba(220,240,193,0.9) 100%)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.14) 0 1px, transparent 1px 22px)",
                opacity: 0.55,
                pointerEvents: "none",
              }} />
              <div style={{
                padding: "8px 10px 10px",
                fontSize: 11,
                color: "#183418",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="思考を入力..."
                  rows={3}
                  disabled={releasing}
                  style={{
                    width: "100%",
                    minHeight: 68,
                    border: "none",
                    background: "transparent",
                    color: "#183418",
                    fontSize: 13,
                    fontWeight: 700,
                    lineHeight: 1.45,
                    outline: "none",
                    resize: "none",
                    padding: 0,
                    pointerEvents: "auto",
                  }}
                />
              </div>
              <div style={{
                position: "absolute",
                bottom: -9,
                left: 22,
                width: 18,
                height: 18,
                background: "linear-gradient(180deg, rgba(246,255,226,0.94), rgba(220,240,193,0.9))",
                transform: "rotate(45deg)",
                borderRight: "1px solid rgba(255,255,255,0.22)",
                borderBottom: "1px solid rgba(255,255,255,0.22)",
              }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
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

          <Link href="/" style={{
            fontSize: 13,
            color: "#666",
            textDecoration: "none",
            transition: "color 0.2s",
          }} onMouseEnter={(e) => e.currentTarget.style.color = "#aaa"} onMouseLeave={(e) => e.currentTarget.style.color = "#666"}>
            ホームに戻る
          </Link>
        </div>

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