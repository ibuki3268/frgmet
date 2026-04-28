"use client";
import { useRef } from "react";
import { useStarField } from "../hooks/useStarField";
import Link from "next/link";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStarField(canvasRef);

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