import axios from "axios";
import { load } from "cheerio";

type BookmakerOdds = {
  [key: string]: string | undefined;
  draftkings?: string;
  fanduel?: string;
  betmgm?: string;
  caesars?: string;
  bet365?: string;
  betrivers?: string;
};

type MvpOdd = {
  player: string;
  odds: BookmakerOdds;
};

type Bookmaker = {
  id: string;
  name: string;
  logo: string;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sport = url.searchParams.get("sport") || "nfl";

    const apiUrl =
      sport === "nba"
        ? "https://www.vegasinsider.com/nba/odds/mvp/"
        : "https://www.vegasinsider.com/nfl/odds/mvp/";

    const { data } = await axios.get(apiUrl);
    const $ = load(data);
    const mvpOdds: MvpOdd[] = [];
    const bookmakers: Bookmaker[] = [];

    // Get the header cells excluding the last column
    $("table.odds-table thead tr:first-child th:not(:last-child)").each((index, element) => {
      if (index > 0) {
        // Skip the first column (Player name)
        const name = $(element).text().trim();
        const logo = $(element).find(".book-icn img").attr("src") || "";
        const logoUrl = logo.startsWith("http") ? logo : `https://www.vegasinsider.com${logo}`;
        const id = name.toLowerCase().replace(/\s+/g, "");
        bookmakers.push({ id, name, logo: logoUrl });
      }
    });

    // Process each row excluding the last column
    $("table.odds-table tbody tr").each((index, row) => {
      const player = $(row).find("td:first-child").text().trim();
      const odds: BookmakerOdds = {};

      $(row)
        .find("td:not(:last-child)") // Exclude the last column
        .slice(1) // Skip the player name column
        .each((cellIndex, cell) => {
          const odd = $(cell).text().trim();
          if (bookmakers[cellIndex]) {
            odds[bookmakers[cellIndex].id] = odd;
          }
        });

      if (player) {
        mvpOdds.push({ player, odds });
      }
    });

    return new Response(JSON.stringify({ mvpOdds, bookmakers }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching MVP odds:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch MVP odds" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
