import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Game = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  sport: string;
};

export default function GameCard({ game }: { game: Game }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {game.homeTeam} vs {game.awayTeam}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Start Time: {new Date(game.startTime).toLocaleString()}</p>
        <Badge className="mt-2">{game.sport}</Badge>
      </CardContent>
    </Card>
  );
}
