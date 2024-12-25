"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Event } from "@/types/odds";
import Image from "next/image";

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

export default function SportsBetting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-4xl font-bold mb-6">Sports Lines & DFS</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search teams, games, or contests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="betting-lines" className="space-y-4">
        <TabsList>
          <TabsTrigger value="betting-lines">Betting Lines</TabsTrigger>
          <TabsTrigger value="daily-fantasy">Daily Fantasy</TabsTrigger>
        </TabsList>

        <TabsContent value="betting-lines">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
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
                                <span key={outcome.name} className="font-mono">
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
        </TabsContent>

        <TabsContent value="daily-fantasy">
          <div className="text-center py-8 text-muted-foreground">Daily Fantasy content coming soon...</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
