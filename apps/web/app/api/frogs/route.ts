import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Frog } from "@frog/shared";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
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