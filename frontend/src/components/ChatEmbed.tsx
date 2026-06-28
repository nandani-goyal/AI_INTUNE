import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Users } from "lucide-react";
import chatIconsImg from "@/assets/chat-icons.jpg";
import socket from "@/lib/socket";
import { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
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
interface Message {
  sender: {
    _id: string;
    anonymousId: string;
  };

  text: string;

  createdAt: string;
}


const ChatEmbed = ({ selectedUser }: ChatEmbedProps) => {
  const { user } = useAuth();

const [messages, setMessages] = useState<Message[]>([]);

const [chatId,setChatId] = useState("");

const [newMessage,setNewMessage] = useState("");
useEffect(() => {

    if (!selectedUser) return;

    loadChat();

}, [selectedUser]);

const loadChat = async () => {

    try {

        const token = localStorage.getItem("token");

        // Create or get existing chat
        const res = await fetch(
            "http://localhost:5000/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    matchedUserId: selectedUser?.id
                })
            }
        );
        console.log(selectedUser);
        const chat = await res.json();

        setChatId(chat._id);

        socket.emit("join-chat", chat._id);

        // Fetch old messages
        const msgRes = await fetch(
            `http://localhost:5000/api/chat/${chat._id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const msgs = await msgRes.json();

        setMessages(msgs);

    }

    catch (err) {

        console.log(err);

    }

};
useEffect(() => {

    socket.on("receive-message", (message) => {

        setMessages(prev => [...prev, message]);

    });

    return () => {

        socket.off("receive-message");

    };

}, []);
 

  


  

  const handleSendMessage = () => {

    if (!newMessage.trim()) return;

    socket.emit("send-message",{

chatId,

sender:user?._id,

text:newMessage

});

setNewMessage("");

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
            className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-xs shadow-sm ${
               message.sender._id === user?._id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white text-foreground'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className={`text-xs ${
               message.sender._id === user?._id
                  ? 'text-primary-foreground/80' 
                  : 'text-muted-foreground'
              }`}>
                {new Date(message.createdAt).toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit"
})}
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