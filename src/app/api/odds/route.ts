// import { NextResponse } from "next/server";
// import { FormattedOddsData, Bookmaker, Event, Market } from "@/types/sports";

// const API_KEY = process.env.ODDS_API_KEY || "YOUR_API_KEY_HERE";
// //const API_HOST = 'https://api.the-odds-api.com'

// export async function GET() {
//   try {
//     // For this example, we'll use the provided data instead of fetching from an API
//     const rawData = {
//       eventId: "12345",
//       participant1: "Team A",
//       participant2: "Team B",
//       startTime: "2024-03-08T19:00:00Z",
//       markets: [
//         {
//           key: "h2h",
//           outcomes: [
//             { name: "Team A", price: 1.5 },
//             { name: "Team B", price: 2.5 },
//           ],
//         },
//         {
//           key: "spreads",
//           outcomes: [
//             { name: "Team A", price: 1.8, point: -1.5 },
//             { name: "Team B", price: 2.2, point: 1.5 },
//           ],
//         },
//         {
//           key: "totals",
//           outcomes: [
//             { name: "Over", price: 1.9, point: 2.5 },
//             { name: "Under", price: 1.9, point: 2.5 },
//           ],
//         },
//       ],
//       bookmakers: {
//         Bet365: {
//           name: "Bet365",
//         },
//         WilliamHill: {
//           name: "William Hill",
//         },
//       },
//     };

//     const bookmakers: Bookmaker[] = Object.entries(rawData.bookmakers).map(([key, value]) => ({
//       key,
//       name: value.name,
//       logo: `/logos/${key.toLowerCase()}.png`, // Assuming you have logo images with lowercase bookmaker names
//     }));

//     const event: Event = {
//       id: rawData.eventId,
//       homeTeam: rawData.participant1,
//       awayTeam: rawData.participant2,
//       startTime: rawData.startTime,
//       markets: rawData.markets,
//     };

//     const formattedData: FormattedOddsData = {
//       event,
//       bookmakers,
//     };

//     return NextResponse.json({ data: [formattedData] });
//   } catch (error) {
//     console.error("Error processing odds data:", error);
//     return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
//   }
// }
