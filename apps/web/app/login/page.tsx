"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, loginWithGoogle, error } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
      }}>
        読み込み中...
      </main>
    );
  }

  return (
    <main style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#000",
      position: "relative",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000 100%)",
      }} />

      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        textAlign: "center",
      }}>
        <div>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🐸</div>
          <h1 style={{ color: "#fff", fontSize: 32, margin: "0 0 4px" }}>FRGMET</h1>
          <p style={{ color: "#888", fontSize: 14, margin: 0 }}>思考をカエルに乗せて宇宙へ放流する</p>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
          minWidth: 280,
        }}>
          <button
            onClick={loginWithGoogle}
            style={{
              padding: "14px 24px",
              borderRadius: 8,
              border: "1px solid #444",
              background: "#fff",
              color: "#000",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            🔐 Googleでログイン
          </button>

          <Link href="/" style={{
            padding: "14px 24px",
            borderRadius: 8,
            border: "1px solid #444",
            background: "transparent",
            color: "#666",
            fontSize: 14,
            textDecoration: "none",
            textAlign: "center",
            transition: "color 0.2s",
            cursor: "pointer",
          }} onMouseEnter={(e) => e.currentTarget.style.color = "#aaa"} onMouseLeave={(e) => e.currentTarget.style.color = "#666"}>
            ログインなしで続行
          </Link>
        </div>

        {error && (
          <div style={{
            padding: 12,
            borderRadius: 8,
            background: "rgba(255, 0, 0, 0.1)",
            color: "#ff6b6b",
            fontSize: 13,
          }}>
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
