import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PartyPopper, User, Mail, Heart, Brain } from "lucide-react";

interface RoommateRevealDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoommateRevealDialog = ({ isOpen, onClose }: RoommateRevealDialogProps) => {
  const [enteredId, setEnteredId] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    if (enteredId.trim()) {
      setIsRevealed(true);
    }
  };

  const handleDashboard = () => {
    // PASTE YOUR DASHBOARD REDIRECT LINK HERE
    // Example: window.location.href = "https://your-dashboard-url.com";
    // Or: window.open("https://your-dashboard-url.com", "_blank");
    
    alert("Redirecting to dashboard... (Replace this alert with your dashboard link in RoommateRevealDialog.tsx line 32)");
    onClose();
  };

  const handleContinueChat = () => {
    // PASTE YOUR PRIVATE CHAT REDIRECT LINK HERE  
    // Example: window.location.href = "https://your-private-chat-url.com?user=MOON_1305";
    // Or: window.open("https://your-private-chat-url.com?user=MOON_1305", "_blank");
    
    alert("Opening private chat... (Replace this alert with your private chat link in RoommateRevealDialog.tsx line 38)");
    onClose();
  };

  const resetDialog = () => {
    setEnteredId("");
    setIsRevealed(false);
    onClose();
  };

  if (!isRevealed) {
    return (
      <Dialog open={isOpen} onOpenChange={resetDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Finalize Your Roommate
            </DialogTitle>
            <DialogDescription>
              Enter the ID of the roommate you want to finalize your match with.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="roommate-id" className="text-sm font-medium">
                Roommate ID:
              </Label>
              <Input
                id="roommate-id"
                placeholder="Enter roommate ID (e.g., USER_1247)"
                value={enteredId}
                onChange={(e) => setEnteredId(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={resetDialog}>
              Cancel
            </Button>
            <Button onClick={handleReveal} disabled={!enteredId.trim()}>
              Reveal Match
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <PartyPopper className="h-6 w-6 text-yellow-500" />
            🎉 Matched Reveal!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-br from-warm-accent/20 to-secondary/20 rounded-lg border border-warm-accent/30">
            <h3 className="text-lg font-semibold mb-4">You are now connected with:</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span className="font-medium">User ID: MOON_1305</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span className="font-medium">Name: Suhani Gupta</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>Email: suhani@xyz.com</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Preference Match: <strong className="text-green-600">92%</strong></span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Vibe: "Night Owl + Clean" ✔️</span>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground font-medium">
              Start planning your room together!
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Button onClick={handleDashboard} className="w-full" size="lg">
            Go to Dashboard
          </Button>
          <Button 
            onClick={handleContinueChat} 
            variant="outline" 
            className="w-full" 
            size="lg"
          >
            Continue Chatting with MOON_1305
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoommateRevealDialog;