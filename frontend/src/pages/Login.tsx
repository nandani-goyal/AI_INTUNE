import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { Mail, Lock, ArrowRight, Home } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { API } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  /* ───────────────────────────────────────────────
   helper: POST to <backend>/api/<path>
   (Put these two lines near the top, after imports)
──────────────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

async function request<T>(path: string, body: unknown): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Request failed");
  return data as T;
}

/* ───────────────────────────────────────────────
   UPDATED HANDLERS
──────────────────────────────────────────────── */
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    /* 1️⃣  hit the Express login endpoint */
    type Resp = { token: string; name: string; email: string };
    const data = await request<Resp>("/auth/login", { email, password });

    /* 2️⃣  persist JWT so subsequent requests can include it */
    localStorage.setItem("token", data.token);
    // setUser({ _id: data._id, name: data.name, email: data.email, anonymousId: data.anonymousId });

    /* 3️⃣  user feedback + redirect */
    toast({
      title: `Welcome back, ${data.name}!`,
      description: "Redirecting to your dashboard…"
    });

    // if you already use react-router’s useNavigate:
    // navigate("/dashboard");
  } catch (err: any) {
    toast({
      title: "Login failed",
      description: err.message,
      variant: "destructive"
    });
  }
};

const handleGoogleLogin = () => {
  toast({
    title: "Google Login",
    description: "Google OAuth not wired yet – coming soon!"
  });
};


  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />
      
      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <Link 
            to="/" 
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-smooth"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Card className="bg-card-gradient border-border/50 shadow-warm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">
                Welcome Back to InTune
              </CardTitle>
              <CardDescription>
                Sign in to continue your roommate matching journey
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Google Login */}
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full" 
                onClick={handleGoogleLogin}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="text-primary hover:text-primary/80">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                  Sign up here
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            🔒 Your data is protected with end-to-end encryption and anonymous ID systems.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;