import { NextResponse } from "next/server";
import { getTopLeaderboard } from "@/lib/leaderboard";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 50));

  try {
    const leaderboard = await getTopLeaderboard(limit);

    return NextResponse.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to retrieve leaderboard" },
      { status: 500 }
    );
  }
}
