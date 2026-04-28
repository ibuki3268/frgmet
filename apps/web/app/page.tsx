"use client";
import { useRef } from "react";
import Link from "next/link";
import { useStarField } from "../hooks/useStarField";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user, loading, logout } = useAuth();
  useStarField(canvasRef);

  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#000", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000 100%)" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      <div style={{
        position: "absolute",
        top: 24,
        right: 24,
        display: "flex",
        gap: 12,
        alignItems: "center",
        zIndex: 10,
      }}>
        {loading ? (
          <span style={{ color: "#666", fontSize: 13 }}>読込中...</span>
        ) : user ? (
          <>
            <span style={{ color: "#aaa", fontSize: 13 }}>{user.email?.split("@")[0] || "ユーザー"}</span>
            <Link href="/mypage" style={{
              padding: "6px 12px",
              borderRadius: 6,
              background: "#222",
              color: "#aaa",
              fontSize: 12,
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
              cursor: "pointer",
              display: "inline-block",
            }} onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#aaa"; }}>
              マイページ
            </Link>
            <button
              onClick={logout}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: "transparent",
                border: "1px solid #444",
                color: "#888",
                fontSize: 12,
                cursor: "pointer",
                transition: "color 0.2s, border 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ff6b6b"; e.currentTarget.style.borderColor = "#ff6b6b"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#444"; }}
            >
              ログアウト
            </button>
          </>
        ) : (
          <Link href="/login" style={{
            padding: "6px 12px",
            borderRadius: 6,
            background: "#1a3a6b",
            color: "#fff",
            fontSize: 12,
            textDecoration: "none",
            display: "inline-block",
          }}>
            ログイン
          </Link>
        )}
      </div>

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 64 }}>🐸</div>
          <h1 style={{ fontSize: 32, margin: "12px 0 4px" }}>FRGMET</h1>
          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>思考をカエルに乗せて宇宙へ放流する</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "min(320px, 90vw)" }}>
          <Link href="/release" style={{
            display: "block",
            padding: "14px 24px",
            borderRadius: 10,
            background: "#1a6b3a",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            fontSize: 16,
          }}>
            放流する
          </Link>
          <Link href="/receive" style={{
            display: "block",
            padding: "14px 24px",
            borderRadius: 10,
            background: "#1a3a6b",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            fontSize: 16,
          }}>
            受け取る
          </Link>
          <Link href="/stream" style={{
            display: "block",
            padding: "14px 24px",
            borderRadius: 10,
            background: "#2a1a6b",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            fontSize: 16,
          }}>
            流れを見る
          </Link>
        </div>
      </div>
    </main>
  );
}