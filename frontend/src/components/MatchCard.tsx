import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Key, User } from "lucide-react";

interface MatchData {
  anon_id: string;
  match_score: number;
  criteria_scores: {
    cleanliness: number;
    sleep_schedule: number;
    social_habits: number;
    lifestyle: number;
    food: number;
  };
  chatroom_passkey: string;
}

interface MatchCardProps {
  match: MatchData;
  rank: number;
  onMessage: (passkey: string) => void;
}

const MatchCard = ({ match, rank, onMessage }: MatchCardProps) => {
  const criteriaIcons = {
    cleanliness: "🧼",
    sleep_schedule: "🌙",
    social_habits: "🗣️",
    lifestyle: "🧘",
    food: "🍽️",
  };

  const criteriaLabels = {
    cleanliness: "Cleanliness",
    sleep_schedule: "Sleep",
    social_habits: "Social",
    lifestyle: "Lifestyle",
    food: "Food",
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-accent";
    return "text-muted-foreground";
  };

  const getRankBadge = (rank: number) => {
    const badges = {
      1: { text: "🥇 Best Match", variant: "default" as const },
      2: { text: "🥈 Great Match", variant: "secondary" as const },
      3: { text: "🥉 Good Match", variant: "outline" as const },
    };
    return badges[rank as keyof typeof badges] || { text: `#${rank} Match`, variant: "outline" as const };
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card border-border">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-warm-brown rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{match.anon_id}</h3>
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">PassKey: {match.chatroom_passkey}</span>
              </div>
            </div>
          </div>
          <Badge {...getRankBadge(rank)} className="px-3 py-1">
            {getRankBadge(rank).text}
          </Badge>
        </div>

        {/* Overall Match Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Compatibility</span>
            <span className={`text-xl font-bold ${getScoreColor(match.match_score)}`}>
              {match.match_score}%
            </span>
          </div>
          <Progress 
            value={match.match_score} 
            className="h-3 bg-muted"
          />
        </div>

        {/* Criteria Breakdown */}
        <div className="space-y-3 mb-6">
          {Object.entries(match.criteria_scores).map(([criterion, score]) => (
            <div key={criterion} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{criteriaIcons[criterion as keyof typeof criteriaIcons]}</span>
                <span className="text-sm font-medium text-foreground">
                  {criteriaLabels[criterion as keyof typeof criteriaLabels]}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      score >= 80 ? 'bg-success' : score >= 60 ? 'bg-accent' : 'bg-muted-foreground'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${getScoreColor(score)} min-w-[3rem] text-right`}>
                  {score}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Button 
          variant="message" 
          className="w-full"
          onClick={() => onMessage(match.chatroom_passkey)}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Start Conversation
        </Button>
      </CardContent>
    </Card>
  );
};

export default MatchCard;