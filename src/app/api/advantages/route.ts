import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const options = {
    method: "GET",
    url: "https://sportsbook-api2.p.rapidapi.com/v0/advantages/",
    params: {
      type: "ARBITRAGE",
    },
    headers: {
      "X-RapidAPI-Key": "be65dff0f2msh8f49e271a0eabbfp13ea2cjsnd42a96590cd5",
      "X-RapidAPI-Host": "sportsbook-api2.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching advantages:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
