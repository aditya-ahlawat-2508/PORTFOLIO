import { NextResponse } from "next/server";
import { getLeetCodeStats } from "@/lib/fetchers";

export const revalidate = 3600;

export async function GET() {
  const stats = await getLeetCodeStats();
  return NextResponse.json(stats);
}
