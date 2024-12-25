"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Custom Select Component
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookmakerOdds = {
  [key: string]: string | undefined;
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

export default function MvpOdds() {
  const [mvpOdds, setMvpOdds] = useState<MvpOdd[]>([]);
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([]);
  const [filteredOdds, setFilteredOdds] = useState<MvpOdd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sport, setSport] = useState<"nfl" | "nba">("nfl"); // State to store selected sport

  useEffect(() => {
    const fetchMvpOdds = async () => {
      try {
        const response = await fetch(`/api/mvp?sport=${sport}`);
        if (!response.ok) {
          throw new Error("Failed to fetch MVP odds");
        }
        const data = await response.json();
        setMvpOdds(data.mvpOdds);
        setBookmakers(data.bookmakers);
        setFilteredOdds(data.mvpOdds);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMvpOdds();
  }, [sport]); // Fetch new data when the selected sport changes

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    const filtered = mvpOdds.filter((odd) => odd.player.toLowerCase().includes(value));
    setFilteredOdds(filtered);
  };

  const handleSportChange = (value: "nfl" | "nba") => {
    setSport(value); // Update sport state when value changes
  };

  const getOddClassName = (odd: string | undefined) => {
    if (!odd) return "";
    return parseFloat(odd) > 0 ? "bg-amber-100" : "bg-green-100";
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  if (filteredOdds.length === 0) return <div className="p-8 text-center text-gray-500">No players found</div>;

  return (
    <div className="py-20 px-4 flex  items-start  gap-4">
      <Card className="w-full  shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">MVP ODDS</CardTitle>
          <div className="mt-4 flex justify-center gap-4">
            {/* Select Dropdown for Sport */}
            <Select onValueChange={handleSportChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sports</SelectLabel>
                  <SelectItem value="nfl">NFL</SelectItem>
                  <SelectItem value="nba">NBA</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Filter Input */}
            <Input placeholder="Filter by player name" onChange={handleFilter} className="max-w-sm" />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Player</TableHead>
                {bookmakers.map((bookmaker) => (
                  <TableHead key={bookmaker.id} className="text-center min-w-[100px]">
                    {bookmaker.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOdds.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.player}</TableCell>
                  {bookmakers.map((bookmaker) => (
                    <TableCell
                      key={bookmaker.id}
                      className={`text-center ${getOddClassName(item.odds[bookmaker.id])}`}
                    >
                      {item.odds[bookmaker.id] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
