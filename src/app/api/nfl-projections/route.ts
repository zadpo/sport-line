import axios from "axios";
import { load } from "cheerio";

interface PlayerProjection {
  name: string;
  position: string;
  team: string;
  teamLogo: string;
  opponent: string;
  passingYards: string;
  passingTD: string;
  interceptions: string;
  rushingYards: string;
  rushingTD: string;
  receptions: string;
  receivingYards: string;
  receivingTD: string;
  returnTD: string;
  fumbleTD: string;
  twoPt: string;
  fumbleLost: string;
  fantasyPoints: string;
}

export async function GET() {
  try {
    const { data } = await axios.get("https://fantasy.nfl.com/research/projections");
    const $ = load(data);
    const projections: PlayerProjection[] = [];

    $("table.tableType-player tbody tr").each((_, row) => {
      const $row = $(row);

      // Extract player info from the first cell
      const playerCell = $row.find("td.playerNameAndInfo");
      const name = playerCell.find("a.playerName").text().trim();
      const [position, team] = playerCell.find("em").text().trim().split(" - ");

      // Get the team div class and extract background image
      const teamDiv = playerCell.find("div[class^='c c-']");
      const teamClass = teamDiv.attr("class");
      console.log("Team class:", teamClass); // For debugging

      // Get computed styles or background image
      const styles = teamDiv.find("b").attr("style");
      console.log("Team styles:", styles); // For debugging

      const projection: PlayerProjection = {
        name,
        position,
        team,
        teamLogo: styles || "", // Store the full style string for now
        opponent: $row.find("td.playerOpponent").text().trim(),
        passingYards: $row.find(".stat_5 span").text().trim(),
        passingTD: $row.find(".stat_6 span").text().trim(),
        interceptions: $row.find(".stat_7 span").text().trim(),
        rushingYards: $row.find(".stat_14 span").text().trim(),
        rushingTD: $row.find(".stat_15 span").text().trim(),
        receptions: $row.find(".stat_20 span").text().trim(),
        receivingYards: $row.find(".stat_21 span").text().trim(),
        receivingTD: $row.find(".stat_22 span").text().trim(),
        returnTD: $row.find(".stat_28 span").text().trim(),
        fumbleTD: $row.find(".stat_29 span").text().trim(),
        twoPt: $row.find(".stat_32 span").text().trim(),
        fumbleLost: $row.find(".stat_30 span").text().trim(),
        fantasyPoints: $row.find(".projected span").text().trim(),
      };

      projections.push(projection);
    });

    return new Response(JSON.stringify({ projections }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching NFL projections:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch NFL projections" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
