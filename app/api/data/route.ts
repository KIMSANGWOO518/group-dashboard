import { NextRequest, NextResponse } from "next/server";
import { getAllWeeks, addOrUpdateWeek, deleteWeek } from "@/lib/kv";
import { WeekEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const weeks = await getAllWeeks();
  return NextResponse.json(weeks);
}

export async function POST(req: NextRequest) {
  const entry: WeekEntry = await req.json();
  if (!entry.id || !entry.date) {
    return NextResponse.json({ error: "id, date 필드가 필요합니다." }, { status: 400 });
  }
  await addOrUpdateWeek(entry);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
  await deleteWeek(id);
  return NextResponse.json({ ok: true });
}
