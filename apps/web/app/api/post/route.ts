import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FrogGrade } from "@frog/shared";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MOCK = process.env.MOCK_AI === "true";

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  let judged: { grade: FrogGrade; lifespan_years: number; reason: string };

  if (MOCK) {
    judged = { grade: "alive", lifespan_years: 5000, reason: "mock" };
  } else {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `以下の投稿内容を評価し、JSONのみを返せ。余計な文字は一切不要。

投稿: "${content}"

評価基準（厳しく評価せよ。ほとんどの投稿はdeadかweakである）:
- dead: 意味不明、スパム、一言感想、日常報告（寿命: 1〜9年）
- weak: 普通の意見、よくある考え、特筆なし（寿命: 10〜999年）
- alive: 独自の洞察、具体的で有益、読む価値あり（寿命: 1000〜9999年）
- immortal: 人類史に残るレベル、真に独創的（寿命: 10000〜1000000年）

返却形式:
{"grade":"alive","lifespan_years":5000,"reason":"理由を一言で"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    judged = JSON.parse(text.replace(/```json|```/g, ""));
  }

  const { data, error } = await supabase
    .from("frogs")
    .insert({
      content,
      lifespan_years: judged.lifespan_years,
      grade: judged.grade,
      reason: judged.reason,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}