import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatList from "@/components/ChatList";
import ChatEmbed from "@/components/ChatEmbed";
import RoommateRevealDialog from "@/components/RoommateRevealDialog";
import heroRoommateImg from "@/assets/hero-roommate.jpg";

interface User {
  id: string;
  name: string;
  matchPercentage: number;
  lastMessage: string;
  timeAgo: string;
  tags: string[];
  passKey: string;
  isOnline: boolean;
}

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [revealDialogOpen, setRevealDialogOpen] = useState(false);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero section */}
      <div className="relative bg-gradient-warm py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Find Your Perfect
                <span className="text-primary block">Roommate Match</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Connect with like-minded people who share your living preferences, study habits, and lifestyle. Your vibe is the key to your perfect co-living match.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>88% Average Match Rate</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>5,000+ Active Users</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  <span>Safe Anonymous Chat</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroRoommateImg} 
                alt="Perfect roommate match" 
                className="w-full h-80 object-cover rounded-2xl shadow-soft"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main chat interface */}
      <div className="flex-1 flex">
        {/* Left sidebar - Chat list */}
        <div className="w-full lg:w-96 border-r border-border bg-card">
          <ChatList 
            // onUserSelect={handleUserSelect}
            selectedUser={selectedUser}
          />
        </div>

        {/* Right area - Chat embed */}
        <div className="flex-1">
          <ChatEmbed selectedUser={selectedUser} />
        </div>
      </div>

      {/* Fixed roommate action button */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 bg-gradient-to-r from-warm-accent/20 to-secondary/20 border-warm-accent/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Ready to Finalize Your Roommate?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter your chosen roommate's ID to reveal their real identity and start planning together!
                </p>
              </div>
              <Button 
                onClick={() => setRevealDialogOpen(true)}
                size="lg"
                className="bg-primary hover:bg-primary/90 px-8"
              >
                <Heart className="h-4 w-4 mr-2" />
                Finalize Roommate
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Footer />

      {/* Roommate reveal dialog */}
      <RoommateRevealDialog
        isOpen={revealDialogOpen}
        onClose={() => setRevealDialogOpen(false)}
      />
    </div>
  );
};

export default Chat;