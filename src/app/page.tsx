"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiResponse, Event, Outcome } from "@/types/sports";
import { SPORTSBOOKS } from "@/lib/sportsbooks";

interface GroupedOutcomes {
  [eventKey: string]: {
    event: Event;
    moneyline: { [source: string]: Outcome };
    spread: { [source: string]: Outcome };
  };
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/arbitrage")
      .then((res) => res.json())
      .then((apiData: ApiResponse) => {
        setData(apiData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Group outcomes by event
  const groupedOutcomes: GroupedOutcomes = {};
  data?.advantages.forEach((advantage) => {
    const eventKey = advantage.market.event.key;
    if (!groupedOutcomes[eventKey]) {
      groupedOutcomes[eventKey] = {
        event: advantage.market.event,
        moneyline: {},
        spread: {},
      };
    }

    advantage.outcomes.forEach((outcome) => {
      if (advantage.market.type === "MONEYLINE") {
        groupedOutcomes[eventKey].moneyline[outcome.source] = outcome;
      } else if (advantage.market.type === "POINT_SPREAD") {
        groupedOutcomes[eventKey].spread[outcome.source] = outcome;
      }
    });
  });

  // Filter events based on search query
  const filteredEvents = Object.values(groupedOutcomes).filter(({ event }) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="mx-auto py-6 px-[264px]">
      <h1 className="text-4xl font-bold mb-6">Sports Lines & DFS</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search teams, games, or contests..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="betting-lines" className="space-y-4">
        <TabsList>
          <TabsTrigger value="betting-lines">Betting Lines</TabsTrigger>
          <TabsTrigger value="daily-fantasy">Daily Fantasy</TabsTrigger>
        </TabsList>

        <TabsContent value="betting-lines">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Game</TableHead>
                  {SPORTSBOOKS.map((book) => (
                    <TableHead key={book.key} className="text-center">
                      <div className="flex flex-col items-center py-2">
                        <Image src={book.logo} alt={book.name} width={24} height={24} />
                        <span>{book.name}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map(({ event, moneyline, spread }) => (
                  <TableRow key={event.key}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{event.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.startTime).toLocaleString([], {
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </TableCell>
                    {SPORTSBOOKS.map((book) => (
                      <TableCell key={book.key} className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          {moneyline[book.key] && (
                            <span className="font-mono">{formatOdds(moneyline[book.key].payout)}</span>
                          )}
                          {spread[book.key] && (
                            <span className="text-sm text-muted-foreground">
                              {formatSpread(spread[book.key].modifier)} ({formatOdds(spread[book.key].payout)}
                              )
                            </span>
                          )}
                        </div>
                      </TableCell>
                    ))}
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

function formatOdds(payout: number): string {
  const americanOdds = (payout - 1) * 100;
  return americanOdds > 0 ? `+${Math.round(americanOdds)}` : Math.round(americanOdds).toString();
}

function formatSpread(modifier: number): string {
  return modifier > 0 ? `+${modifier}` : modifier.toString();
}
