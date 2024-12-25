import { NextResponse } from "next/server";
import { CompetitionsResponse } from "@/types/sports";

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
      "https://sportsbook-api2.p.rapidapi.com/v0/competitions/?includeInstances=true",
      options
    );

    if (!response.ok) {
      throw new Error("Failed to fetch competitions");
    }

    const data: CompetitionsResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return NextResponse.json({ competitions: [] });
  }
}
