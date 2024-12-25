import { NextResponse } from "next/server";

export async function GET() {
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key":
        process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "be65dff0f2msh8f49e271a0eabbfp13ea2cjsnd42a96590cd5",
      "x-rapidapi-host": "sportsbook-api2.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(
      "https://sportsbook-api2.p.rapidapi.com/v0/advantages/?type=ARBITRAGE",
      options
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching odds:", error);
    return NextResponse.json({ advantages: [] });
  }
}
