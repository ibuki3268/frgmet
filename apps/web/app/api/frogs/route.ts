import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Frog } from "@/types/frog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const random = req.nextUrl.searchParams.get("random");

  if (random === "true") {
    const { data, error } = await supabase
      .from("frogs")
      .select("*")
      .in("grade", ["weak", "alive", "immortal"])
      .limit(100);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data || data.length === 0) return NextResponse.json(null);

    const picked = data[Math.floor(Math.random() * data.length)];
    return NextResponse.json(picked);
  }

  const { data, error } = await supabase
    .from("frogs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body: Omit<Frog, "id" | "created_at"> = await req.json();

  const { data, error } = await supabase
    .from("frogs")
    .insert({
      content: body.content,
      lifespan_years: body.lifespan_years,
      grade: body.grade,
      reason: body.reason,
      pos_x: body.position[0],
      pos_y: body.position[1],
      pos_z: body.position[2],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}