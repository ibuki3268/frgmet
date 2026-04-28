"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "../../hooks/useAuth";
import { useStarField } from "../../hooks/useStarField";
import type { Frog, FrogGrade } from "@/types/frog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export default function MyPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [frogs, setFrogs] = useState<Frog[]>([]);
  const [frogsLoading, setFrogsLoading] = useState(false);
  const fetchedUserIdRef = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStarField(canvasRef);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchMyFrogs = async () => {
      if (!user || loading) return;

      if (fetchedUserIdRef.current === user.id) return;
      fetchedUserIdRef.current = user.id;

      setFrogsLoading(true);
      try {
        const { data: session } = await supabase.auth.getSession();
        const accessToken = session.session?.access_token;

        if (!accessToken) {
          setFrogs([]);
          return;
        }

        const res = await fetch("/api/mypage", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setFrogs(data);
        } else if (res.status === 401) {
          setFrogs([]);
        }
      } catch (e) {
        console.error("マイページ読み込みエラー:", e);
      } finally {
        setFrogsLoading(false);
      }
    };

    if (user) {
      fetchMyFrogs();
    }
  }, [user, loading]);

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

  if (!user) {
    return null;
  }

  const avgLifespan =
    frogs.length > 0
      ? Math.round(frogs.reduce((sum, f) => sum + f.lifespan_years, 0) / frogs.length)
      : 0;

  return (
    <main style={{
      width: "100vw",
      minHeight: "100vh",
      overflow: "auto",
      background: "#000",
      position: "relative",
      paddingBottom: 40,
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000 100%)" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px",
          borderBottom: "1px solid #222",
        }}>
          <h1 style={{ color: "#fff", fontSize: 28, margin: 0 }}>マイページ</h1>
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
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff6b6b";
              e.currentTarget.style.borderColor = "#ff6b6b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#888";
              e.currentTarget.style.borderColor = "#444";
            }}
          >
            ログアウト
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          <div style={{
            display: "flex",
            gap: 24,
            marginBottom: 32,
            flexWrap: "wrap",
          }}>
            <div style={{
              flex: 1,
              minWidth: 200,
              padding: 20,
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid #222",
            }}>
              <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>ユーザー</div>
              <div style={{ color: "#fff", fontSize: 16 }}>{user.email?.split("@")[0] || user.email}</div>
            </div>

            <div style={{
              flex: 1,
              minWidth: 200,
              padding: 20,
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid #222",
            }}>
              <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>放流済みカエル</div>
              <div style={{ color: "#fff", fontSize: 16 }}>{frogs.length}匹</div>
            </div>

            <div style={{
              flex: 1,
              minWidth: 200,
              padding: 20,
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid #222",
            }}>
              <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>平均寿命</div>
              <div style={{ color: "#fff", fontSize: 16 }}>{avgLifespan.toLocaleString()}年</div>
            </div>
          </div>

          <div>
            <h2 style={{ color: "#fff", fontSize: 20, margin: "0 0 16px" }}>放流済みカエル一覧</h2>
            {frogsLoading ? (
              <div style={{ color: "#666", fontSize: 14 }}>読み込み中...</div>
            ) : frogs.length === 0 ? (
              <div style={{
                padding: 32,
                textAlign: "center",
                color: "#666",
                fontSize: 14,
              }}>
                まだカエルを放流していません
                <br />
                <Link href="/release" style={{
                  color: "#1a6b3a",
                  textDecoration: "none",
                  marginTop: 12,
                  display: "inline-block",
                }}>
                  放流してみる →
                </Link>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gap: 12,
              }}>
                {frogs.map((frog) => (
                  <div
                    key={frog.id}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid #222",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    }}
                  >
                    <div style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                    }}>
                      <div style={{ fontSize: 32 }}>{GRADE_EMOJI[frog.grade]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          color: "#fff",
                          fontSize: 14,
                          marginBottom: 8,
                          wordBreak: "break-word",
                        }}>
                          {frog.content}
                        </div>
                        <div style={{
                          display: "flex",
                          gap: 16,
                          fontSize: 12,
                          color: "#888",
                        }}>
                          <span>{GRADE_LABEL[frog.grade]}</span>
                          <span>寿命 {frog.lifespan_years.toLocaleString()}年</span>
                          <span>{new Date(frog.created_at).toLocaleDateString("ja-JP")}</span>
                        </div>
                        {frog.reason && (
                          <div style={{
                            marginTop: 8,
                            fontSize: 12,
                            color: "#aaa",
                            fontStyle: "italic",
                          }}>
                            {frog.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{
          padding: "24px",
          textAlign: "center",
          borderTop: "1px solid #222",
        }}>
          <Link href="/" style={{
            color: "#666",
            textDecoration: "none",
            fontSize: 13,
            transition: "color 0.2s",
          }} onMouseEnter={(e) => e.currentTarget.style.color = "#aaa"} onMouseLeave={(e) => e.currentTarget.style.color = "#666"}>
            ホームに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
