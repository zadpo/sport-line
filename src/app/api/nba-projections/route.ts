import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const options = {
    method: "GET",
    url: "https://tank01-fantasy-stats.p.rapidapi.com/getNBAProjections",
    params: {
      numOfDays: "7",
      pts: "1",
      reb: "1.25",
      TOV: "-1",
      stl: "3",
      blk: "3",
      ast: "1.5",
      mins: "0",
    },
    headers: {
      "X-RapidAPI-Key": "be65dff0f2msh8f49e271a0eabbfp13ea2cjsnd42a96590cd5",
      "X-RapidAPI-Host": "tank01-fantasy-stats.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching NBA projections:", error);
    return NextResponse.json({ error: "Failed to fetch NBA projections" }, { status: 500 });
  }
}
