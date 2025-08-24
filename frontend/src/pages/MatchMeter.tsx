import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MatchCard from "@/components/MatchCard";
import MatchAnalytics from "@/components/MatchAnalytics";
import { TrendingUp, Users, Heart, MessageSquare } from "lucide-react";
import heroImage from "@/assets/hero-roommates.jpg";

// Mock data with user-specified IDs and passkeys
const mockMatches = [
  {
    anon_id: "MOON_1305",
    match_score: 88,
    criteria_scores: {
      cleanliness: 92,
      sleep_schedule: 78,
      social_habits: 85,
      lifestyle: 88,
      food: 65
    },
    chatroom_passkey: "123"
  },
  {
    anon_id: "CLOUD_7097",
    match_score: 85,
    criteria_scores: {
      cleanliness: 88,
      sleep_schedule: 90,
      social_habits: 82,
      lifestyle: 85,
      food: 75
    },
    chatroom_passkey: "456"
  },
  {
    anon_id: "SUN_5672",
    match_score: 82,
    criteria_scores: {
      cleanliness: 85,
      sleep_schedule: 75,
      social_habits: 90,
      lifestyle: 80,
      food: 80
    },
    chatroom_passkey: "777"
  },
  {
    anon_id: "STAR_4357",
    match_score: 79,
    criteria_scores: {
      cleanliness: 80,
      sleep_schedule: 85,
      social_habits: 75,
      lifestyle: 82,
      food: 73
    },
    chatroom_passkey: "098"
  },
  {
    anon_id: "CLOUD_8433",
    match_score: 76,
    criteria_scores: {
      cleanliness: 75,
      sleep_schedule: 82,
      social_habits: 78,
      lifestyle: 76,
      food: 69
    },
    chatroom_passkey: "678"
  }
];

const MatchMeter = () => {
  const { toast } = useToast();
  const [matches] = useState(mockMatches);
  const currentUser = "MOON_3289"; // Main ID taken - current user

  const handleMessage = (passkey: string) => {
    toast({
      title: "Opening Chat Room",
      description: `Connecting you to chat room with PassKey: ${passkey}...`,
      duration: 3000,
    });
    
    // In a real app, this would navigate to the chat room
    console.log(`Opening chat with passkey: ${passkey}`);
  };

  const averageMatch = Math.round(matches.reduce((sum, match) => sum + match.match_score, 0) / matches.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-light-beige to-cream">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={heroImage} 
            alt="Perfect roommate matches" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Your Perfect Matches
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover your top 5 compatibility matches based on lifestyle, habits, and preferences. 
            Your vibe, your tribe, your perfect living situation.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-border">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{matches.length}</div>
                <div className="text-sm text-muted-foreground">Total Matches</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-border">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{averageMatch}%</div>
                <div className="text-sm text-muted-foreground">Avg. Compatibility</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-border">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{matches[0]?.match_score}%</div>
                <div className="text-sm text-muted-foreground">Best Match</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-border">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-warm-brown mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">Chat Ready</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Analytics Dashboard */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Analytics Dashboard</h2>
            <p className="text-muted-foreground mb-8">
              Deep insights into your compatibility patterns and match variations
            </p>
            <MatchAnalytics matches={matches} />
          </div>

          {/* Matches Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-2">Your Top Matches</h2>
                <p className="text-muted-foreground">
                  Connect with your most compatible potential roommates
                </p>
              </div>
              <Button variant="hero" className="hidden md:block">
                View All Matches
              </Button>
            </div>

            {/* Match Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-6">
              {matches.map((match, index) => (
                <MatchCard
                  key={match.anon_id}
                  match={match}
                  rank={index + 1}
                  onMessage={handleMessage}
                />
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-warm-brown to-accent text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Roommate?</h3>
              <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                Start conversations with your top matches and discover your ideal living situation. 
                Your perfect roommate is just a message away!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" className="bg-white text-warm-brown hover:bg-white/90">
                  Refine Preferences
                </Button>
                <Button variant="secondary" size="lg">
                  View All Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MatchMeter;