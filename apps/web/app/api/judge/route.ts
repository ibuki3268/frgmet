import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FrogGrade } from "@frog/shared";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type JudgeResult = {
  grade: FrogGrade;
  lifespan_years: number;
  reason: string;
};

export async function POST(req: NextRequest) {
  const { content } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `以下の投稿内容を評価し、JSONのみを返せ。余計な文字は一切不要。

投稿: "${content}"

評価基準:
- dead: 意味のない投稿、スパム（寿命: 1〜10年）
- weak: 普通の投稿（寿命: 10〜1000年）
- alive: 面白い・有益な投稿（寿命: 1000〜10000年）
- immortal: 傑作・人類的価値がある投稿（寿命: 10000〜1000000年）

返却形式:
{"grade":"alive","lifespan_years":5000,"reason":"理由を一言で"}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const json: JudgeResult = JSON.parse(text.replace(/```json|```/g, ""));
  return NextResponse.json(json);
}
