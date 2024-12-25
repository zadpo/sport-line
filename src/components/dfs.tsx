"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Advantage, EventDetails } from "@/types/dfs";

export default function DFS() {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const advantagesResponse = await fetch("/api/advantages");
        const advantagesData = await advantagesResponse.json();
        setAdvantages(advantagesData.advantages);

        if (advantagesData.advantages.length > 0) {
          const eventId = advantagesData.advantages[0].market.event.key;
          const eventResponse = await fetch(`/api/dfs/event/${eventId}`);
          const eventData = await eventResponse.json();
          setEventDetails(eventData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (eventId: string) => {
    setSelectedEventId(eventId); // Set the selected event ID
  };

  if (loading) return <div className="text-center py-8">Loading DFS data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Daily Fantasy Sports</h1>
      <Tabs defaultValue="advantages">
        <TabsList>
          <TabsTrigger value="advantages">Arbitrage Advantages</TabsTrigger>
          <TabsTrigger value="event">Event Details</TabsTrigger>
        </TabsList>
        <TabsContent value="advantages">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Arbitrage Advantages</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Market Type</TableHead>
                    <TableHead>Participant</TableHead>
                    <TableHead>Odds</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advantages.map((advantage) => (
                    <TableRow
                      key={advantage.key}
                      onClick={() => handleRowClick(advantage.market.event.key)}
                      className="cursor-pointer hover:bg-gray-200"
                    >
                      <TableCell className="text-blue-500">{advantage.market.event.name}</TableCell>
                      <TableCell>{advantage.type}</TableCell>
                      <TableCell>
                        {advantage.market.event.participants?.[0].name || "No Participant"}
                      </TableCell>
                      <TableCell>{advantage.market.outcomes?.[0]?.payout?.toFixed(2) || "N/A"}</TableCell>
                      <TableCell>{advantage.market?.outcomes?.[0]?.source || "Unknown"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="event">
          {eventDetails && selectedEventId && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {eventDetails?.event?.homeTeam?.name} vs {eventDetails?.event?.awayTeam?.name}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Tournament</h3>
                    <p>{eventDetails.event?.tournament.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Season</h3>
                    <p>{eventDetails.event?.season.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Status</h3>
                    <p>{eventDetails.event?.status.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Start Time</h3>
                    <p>{new Date(eventDetails.event?.startTimestamp * 1000).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Score</h3>
                    <p>
                      {eventDetails.event?.homeTeam.shortName} {eventDetails.event?.homeScore.current} -{" "}
                      {eventDetails.event?.awayScore.current} {eventDetails.event?.awayTeam.shortName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
