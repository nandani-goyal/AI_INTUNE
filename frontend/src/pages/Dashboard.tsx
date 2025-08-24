import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import { 
  User, 
  Mic, 
  Users, 
  MessageCircle, 
  Palette, 
  MapPin, 
  Bot,
  Heart,
  Settings,
  LogOut,
  Star,
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";

const Dashboard = () => {
  // Mock user data
  const userData = {
    anonymousId: "Anon_2847",
    completionPercentage: 75,
    matches: 12,
    activeChats: 3,
    completedSteps: [
      "Account Setup",
      "Voice Onboarding",
      "Matching Algorithm"
    ],
    pendingSteps: [
      "Identity Verification",
      "Room Preferences"
    ]
  };

  const quickActions = [
    {
      icon: Mic,
      title: "Voice Onboarding",
      description: "Complete your personality assessment",
      status: "completed",
      link: "/onboarding",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Users,
      title: "View Matches",
      description: "See your compatibility scores",
      status: "active",
      link: "/matches",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Active Chats",
      description: "3 ongoing conversations",
      status: "active",
      link: "/chat",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Palette,
      title: "StyleMatch",
      description: "Set room decoration preferences",
      status: "pending",
      link: "/stylematch",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: MapPin,
      title: "Room Finder",
      description: "Find your perfect room",
      status: "pending",
      link: "/roomfinder",
      color: "bg-teal-100 text-teal-600"
    },
    {
      icon: Bot,
      title: "GuideBot",
      description: "Get help with roommate issues",
      status: "available",
      link: "/guidebot",
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  const recentMatches = [
    { id: "Moon_452", compatibility: 92, status: "chatting", lastActive: "2 hours ago" },
    { id: "Star_789", compatibility: 87, status: "matched", lastActive: "1 day ago" },
    { id: "Sun_321", compatibility: 84, status: "pending", lastActive: "3 days ago" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "active":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Welcome back, {userData.anonymousId}! 👋
              </h1>
              <p className="text-muted-foreground">
                You're in tune. Let's continue your roommate matching journey.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card-gradient border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-primary">
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={userData.completionPercentage} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{userData.completionPercentage}% Complete</span>
                  <span className="text-primary font-medium">
                    {userData.completedSteps.length}/{userData.completedSteps.length + userData.pendingSteps.length} Steps
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-gradient border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-primary">
                Match Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Matches:</span>
                  <span className="font-semibold text-primary">{userData.matches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Chats:</span>
                  <span className="font-semibold text-primary">{userData.activeChats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent-gradient border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-accent-foreground">
                Quick Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete your StyleMatch preferences to get even better room compatibility scores!
              </p>
              <Button variant="hero" size="sm" className="mt-3">
                Complete Now
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Continue your journey to finding the perfect roommate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Link key={index} to={action.link}>
                        <Card className="hover-lift cursor-pointer border-border/50 transition-smooth">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-primary text-sm">
                                    {action.title}
                                  </h3>
                                  {getStatusIcon(action.status)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Matches */}
          <div>
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  Recent Matches
                </CardTitle>
                <CardDescription>
                  Your latest compatibility matches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMatches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-primary">{match.id}</div>
                        <div className="text-xs text-muted-foreground">{match.lastActive}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={match.status === "chatting" ? "default" : "secondary"}
                        className="mb-1"
                      >
                        {match.compatibility}%
                      </Badge>
                      <div className="text-xs text-muted-foreground capitalize">
                        {match.status}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Link to="/matches">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Matches
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="mt-8 bg-hero-gradient border-border/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">
              Recommended Next Steps
            </CardTitle>
            <CardDescription>
              Complete these steps to improve your matching accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.pendingSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-primary font-medium">{step}</span>
                  <Button variant="hero" size="sm" className="ml-auto">
                    Complete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;