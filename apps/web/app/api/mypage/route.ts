import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data, error: userError } = await supabase.auth.getUser(token);

    if (userError || !data.user) {
      return NextResponse.json({ error: "無効な認証トークン" }, { status: 401 });
    }

    const userId = data.user.id;

    const { data: frogs, error } = await supabase
      .from("frogs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(frogs || []);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "エラー" },
      { status: 500 }
    );
  }
}
