import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

// Config options
export const dynamic = "force-dynamic";
export const runtime = "edge";

// Route handler
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const eventId = params.id;

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
  }

  const options = {
    method: "GET",
    url: `https://sportapi7.p.rapidapi.com/api/v1/event/${eventId}`,
    headers: {
      "X-RapidAPI-Key": "eca3c11239mshf39a11682044b16p1d2b52jsnd6eeaa7eb821",
      "X-RapidAPI-Host": "sportapi7.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Error fetching event details:", error);

    if (error instanceof AxiosError) {
      if (error.response?.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
      }
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
