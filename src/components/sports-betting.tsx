"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Event } from "@/types/odds";
import Image from "next/image";
import { Search } from "lucide-react";
// import DFS from "@/components/dfs";
// import NBAProjections from "@/components/NBAProjections";
// Add this object for bookmaker logos
const bookmakerLogos: { [key: string]: string } = {
  FanDuel: "/uploads/fanduel.jpg",
  DraftKings: "/uploads/draftkings.png",
  BetMGM: "/uploads/betmgm.png",
  Bovada: "/uploads/bovada.png",
  BetRivers: "/uploads/betrivers.png",
  BetUS: "/uploads/betus.png",
  "MyBookie.ag": "/uploads/mybookie.png",
  "BetOnline.ag": "/uploads/betonline.png",
  "LowVig.ag": "/uploads/lowvig.png",
};

// Add this function to determine the background color based on odds value
const getOddsColor = (odds: number) => {
  if (odds > 0) {
    return "bg-green-100 dark:bg-green-900/30"; // Positive odds (underdog)
  } else if (odds < 0) {
    return "bg-red-100 dark:bg-red-900/30"; // Negative odds (favorite)
  }
  return ""; // Default/neutral
};

export default function SportsBetting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await fetch("/api/odds");
        if (!response.ok) throw new Error("Failed to fetch odds data");
        const data = await response.json();
        setEvents(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching odds:", error);
        setLoading(false);
      }
    };

    fetchOdds();
  }, []);

  // Get unique bookmakers across all events
  const allBookmakers = Array.from(
    new Set(events.flatMap((event) => event.bookmakers?.map((bookmaker) => bookmaker.title) || []))
  );

  const filteredEvents = events.filter(
    (event) =>
      event.home_team?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.away_team?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setHasSearched(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Sports Lines & DFS</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search teams, games, or contests..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <Tabs defaultValue="betting-lines" className="space-y-4">
        <TabsList>
          <TabsTrigger value="betting-lines">Betting Lines</TabsTrigger>
          <TabsTrigger value="daily-fantasy">Daily Fantasy</TabsTrigger>
        </TabsList>

        <TabsContent value="betting-lines">
          {hasSearched && (
            <div className="space-y-4">
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[300px]">Game</TableHead>
                      {allBookmakers.map((bookmaker) => (
                        <TableHead key={bookmaker} className="text-center">
                          <div className="flex flex-col items-center gap-2 py-2">
                            {bookmakerLogos[bookmaker] && (
                              <Image
                                src={bookmakerLogos[bookmaker]}
                                alt={`${bookmaker} logo`}
                                width={30}
                                height={30}
                              />
                            )}
                            <span className="text-sm font-medium">{bookmaker}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>
                              {event.home_team} vs {event.away_team}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(event.commence_time).toLocaleString([], {
                                month: "numeric",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </TableCell>
                        {allBookmakers.map((bookmakerTitle) => {
                          const bookmaker = event.bookmakers?.find((b) => b.title === bookmakerTitle);
                          const market = bookmaker?.markets?.find((m) => m.key === "h2h");
                          return (
                            <TableCell key={bookmakerTitle} className="text-center">
                              {market?.outcomes ? (
                                <div className="flex flex-col items-center gap-1">
                                  {market.outcomes.map((outcome) => (
                                    <span
                                      key={outcome.name}
                                      className={`font-mono px-2 py-0.5 rounded ${getOddsColor(
                                        outcome.price
                                      )}`}
                                    >
                                      {outcome.price > 0 ? `+${outcome.price}` : outcome.price}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          {!hasSearched && (
            <div className="text-center py-8 text-muted-foreground">
              Enter a search term to view betting lines.
            </div>
          )}
        </TabsContent>

        <TabsContent value="daily-fantasy" className="space-y-6">
          {/* <DFS />
          <NBAProjections /> */}
          <p>Daily Fantasy content coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
