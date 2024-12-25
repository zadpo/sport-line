import { NextResponse } from "next/server";
import { Event } from "@/types/odds";

const API_KEY = process.env.NEXT_PUBLIC_ODDS_API_KEY || "481230913fe1366d9af61332d3fdb1b8";
const API_HOST = "https://api.the-odds-api.com";

export async function GET() {
  try {
    const response = await fetch(
      `${API_HOST}/v4/sports/upcoming/odds/?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=american`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch odds data");
    }

    const data: Event[] = await response.json();

    // We don't need to transform the data, just return it as is
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching odds:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
