import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Await the params (this part may depend on your Next.js version)
  const eventId = params?.id;

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
  }

  const options = {
    method: "GET",
    url: `https://sportapi7.p.rapidapi.com/api/v1/event/7881945`,
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

    // Type assertion: asserting 'error' as AxiosError to access .response
    if (error instanceof AxiosError) {
      // Handle the 429 rate limit error
      if (error.response?.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
      }
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
