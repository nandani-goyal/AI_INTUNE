import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Users } from "lucide-react";
import chatIconsImg from "@/assets/chat-icons.jpg";

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

interface ChatEmbedProps {
  selectedUser: User | null;
}

const ChatEmbed = ({ selectedUser }: ChatEmbedProps) => {
  const [messages, setMessages] = useState<Array<{text: string, isMe: boolean, time: string}>>([]);
  const [newMessage, setNewMessage] = useState("");

  const getInitialConversation = (userId: string) => {
    const conversations = {
      "MOON_1305": [
        { text: "Hi there! I saw we matched with 92% compatibility 🎉", isMe: false, time: "10:30 AM" },
        { text: "Hey! That's amazing! What's your sleep schedule like?", isMe: true, time: "10:32 AM" },
        { text: "I'm definitely a night owl 🦉 Usually sleep around 1-2 AM. You?", isMe: false, time: "10:35 AM" },
        { text: "Perfect! Same here. Are you okay with having friends over occasionally?", isMe: true, time: "10:37 AM" },
        { text: "Absolutely! I love hosting movie nights. How do you feel about cleanliness?", isMe: false, time: "10:40 AM" },
      ],
      "CLOUD_7097": [
        { text: "Hello! Excited about our 85% match rate!", isMe: false, time: "2:15 PM" },
        { text: "Hi! Yes, I'm looking forward to learning more about you.", isMe: true, time: "2:18 PM" },
        { text: "What's your study routine like? I'm pretty focused during exam weeks.", isMe: false, time: "2:20 PM" },
        { text: "I prefer quiet study time too. Do you listen to music while studying?", isMe: true, time: "2:22 PM" },
      ],
      "SUN_5672": [
        { text: "Hey roomie! 78% compatibility sounds promising!", isMe: false, time: "11:45 AM" },
        { text: "Hello! I'd love to know about your daily routine.", isMe: true, time: "11:48 AM" },
        { text: "I'm an early bird! Up by 6 AM for morning jogs. Hope that's not too loud?", isMe: false, time: "11:50 AM" },
        { text: "Not at all! I wake up early too. Do you have any dietary restrictions?", isMe: true, time: "11:52 AM" },
      ],
      "STAR_4357": [
        { text: "Hi! Our 88% match looks really good!", isMe: false, time: "4:20 PM" },
        { text: "Hello! Tell me about your lifestyle preferences.", isMe: true, time: "4:23 PM" },
        { text: "I'm pretty social but respect quiet time. Love weekend game nights!", isMe: false, time: "4:25 PM" },
        { text: "That sounds fun! How often do you have people over?", isMe: true, time: "4:27 PM" },
      ],
      "CLOUD_8433": [
        { text: "Hey there! 83% compatibility - let's chat!", isMe: false, time: "7:10 PM" },
        { text: "Hi! What are you studying?", isMe: true, time: "7:13 PM" },
        { text: "Computer Science! You? I sometimes code late but I use headphones.", isMe: false, time: "7:15 PM" },
        { text: "Business major here! No worries about late coding. Do you smoke?", isMe: true, time: "7:17 PM" },
      ]
    };
    
    return conversations[userId as keyof typeof conversations] || [
      { text: "Hey! Looking forward to getting to know you better!", isMe: false, time: "12:00 PM" }
    ];
  };

  const getAutoResponse = (userMessage: string) => {
    const responses = [
      "That sounds great! Tell me more about that.",
      "I totally agree with you on that point!",
      "Interesting! How do you usually handle that?",
      "That's exactly what I was thinking too!",
      "I'd love to hear more about your experience with that.",
      "That makes a lot of sense to me.",
      "I think we're really compatible on this topic!",
      "That's a great way to look at it.",
      "I've had similar experiences actually.",
      "That sounds like a perfect arrangement to me!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  useEffect(() => {
    if (selectedUser) {
      setMessages(getInitialConversation(selectedUser.id));
    }
  }, [selectedUser]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const userMessage = {
      text: newMessage,
      isMe: true,
      time: currentTime
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Auto-generate response after 1-2 seconds
    setTimeout(() => {
      const autoResponse = {
        text: getAutoResponse(newMessage),
        isMe: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, autoResponse]);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-warm">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6">
            <img 
              src={chatIconsImg} 
              alt="Chat illustration" 
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-card"
            />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Select a match to start chatting
          </h3>
          <p className="text-muted-foreground">
            Choose someone from your matches to begin a conversation and see if you're roommate compatible!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat header */}
      <div className="p-4 border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{selectedUser.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedUser.matchPercentage}% compatible • PassKey: {selectedUser.passKey}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-muted-foreground">
              {selectedUser.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-warm-cream">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-xs shadow-sm ${
                message.isMe 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white text-foreground'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className={`text-xs ${
                message.isMe 
                  ? 'text-primary-foreground/80' 
                  : 'text-muted-foreground'
              }`}>
                {message.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatEmbed;