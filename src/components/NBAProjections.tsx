"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import Image from "next/image";

interface PlayerProjection {
  longName: string;
  team: string;
  pos: string;
  pts: string;
  reb: string;
  ast: string;
  stl: string;
  blk: string;
  TOV: string;
  fantasyPoints: string;
}

interface ProjectionsResponse {
  statusCode: number;
  body: {
    playerProjections: {
      [key: string]: PlayerProjection;
    };
  };
}

interface NFLProjection {
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

export default function NBAProjections() {
  const [projections, setProjections] = useState<ProjectionsResponse | null>(null);
  const [nflProjections, setNflProjections] = useState<NFLProjection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sportType, setSportType] = useState<"NBA" | "NFL">("NBA");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PlayerProjection;
    direction: "asc" | "desc";
  }>({ key: "fantasyPoints", direction: "desc" });
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (sportType === "NBA") {
          const response = await axios.get("/api/nba-projections");
          setProjections(response.data);
        } else {
          const response = await axios.get("/api/nfl-projections");
          setNflProjections(response.data.projections);
        }
      } catch (error) {
        console.error(`Error fetching ${sportType} projections:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sportType]);

  const sortPlayers = (players: PlayerProjection[]) => {
    return [...players].sort((a, b) => {
      if (sortConfig.key === "longName" || sortConfig.key === "team" || sortConfig.key === "pos") {
        return sortConfig.direction === "asc"
          ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
          : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
      }

      const aValue = parseFloat(a[sortConfig.key]) || 0;
      const bValue = parseFloat(b[sortConfig.key]) || 0;
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  const requestSort = (key: keyof PlayerProjection) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return <div>Loading projections...</div>;
  }

  if (!projections) {
    return <div>No projections available</div>;
  }

  const players = Object.values(projections.body.playerProjections);
  const filteredPlayers = players.filter(
    (player) =>
      player.longName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.pos.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedPlayers = sortPlayers(filteredPlayers);

  const totalPages = Math.ceil(sortedPlayers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlayers = sortedPlayers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Card className="shadow-none w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{sportType} Player Projections</CardTitle>
          <Select value={sportType} onValueChange={(value: "NBA" | "NFL") => setSportType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NBA">NBA</SelectItem>
              <SelectItem value="NFL">NFL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        {sportType === "NBA" ? (
          // NBA Table
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort("longName")} className="cursor-pointer">
                  Player
                </TableHead>
                <TableHead onClick={() => requestSort("team")} className="cursor-pointer">
                  Team
                </TableHead>
                <TableHead onClick={() => requestSort("pos")} className="cursor-pointer">
                  POS
                </TableHead>
                <TableHead onClick={() => requestSort("pts")} className="cursor-pointer">
                  PTS
                </TableHead>
                <TableHead onClick={() => requestSort("reb")} className="cursor-pointer">
                  REB
                </TableHead>
                <TableHead onClick={() => requestSort("ast")} className="cursor-pointer">
                  AST
                </TableHead>
                <TableHead onClick={() => requestSort("stl")} className="cursor-pointer">
                  STL
                </TableHead>
                <TableHead onClick={() => requestSort("blk")} className="cursor-pointer">
                  BLK
                </TableHead>
                <TableHead onClick={() => requestSort("TOV")} className="cursor-pointer">
                  TOV
                </TableHead>
                <TableHead onClick={() => requestSort("fantasyPoints")} className="cursor-pointer">
                  FPTS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlayers.map((player, index) => (
                <TableRow key={index}>
                  <TableCell className="text-blue-500">{player.longName}</TableCell>
                  <TableCell>{player.team}</TableCell>
                  <TableCell>{player.pos}</TableCell>
                  <TableCell>{parseFloat(player.pts).toFixed(1)}</TableCell>
                  <TableCell>{parseFloat(player.reb).toFixed(1)}</TableCell>
                  <TableCell>{parseFloat(player.ast).toFixed(1)}</TableCell>
                  <TableCell>{parseFloat(player.stl).toFixed(1)}</TableCell>
                  <TableCell>{parseFloat(player.blk).toFixed(1)}</TableCell>
                  <TableCell>{parseFloat(player.TOV).toFixed(1)}</TableCell>
                  <TableCell>{parseFloat(player.fantasyPoints).toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          // NFL Table
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Pos</TableHead>
                <TableHead>Opp</TableHead>
                <TableHead>Pass Yds</TableHead>
                <TableHead>Pass TD</TableHead>
                <TableHead>INT</TableHead>
                <TableHead>Rush Yds</TableHead>
                <TableHead>Rush TD</TableHead>
                <TableHead>Rec</TableHead>
                <TableHead>Rec Yds</TableHead>
                <TableHead>Rec TD</TableHead>
                <TableHead>FPTS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nflProjections
                .filter(
                  (player) =>
                    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    player.position.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(startIndex, startIndex + ITEMS_PER_PAGE)
                .map((player, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-blue-500">{player.name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      {player.teamLogo && (
                        <Image
                          src={player.teamLogo}
                          alt={`${player.team} logo`}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      )}
                      {player.team}
                    </TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.opponent}</TableCell>
                    <TableCell>{player.passingYards}</TableCell>
                    <TableCell>{player.passingTD}</TableCell>
                    <TableCell>{player.interceptions}</TableCell>
                    <TableCell>{player.rushingYards}</TableCell>
                    <TableCell>{player.rushingTD}</TableCell>
                    <TableCell>{player.receptions}</TableCell>
                    <TableCell>{player.receivingYards}</TableCell>
                    <TableCell>{player.receivingTD}</TableCell>
                    <TableCell>{player.fantasyPoints}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, sortedPlayers.length)} of{" "}
            {sortedPlayers.length} players
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
