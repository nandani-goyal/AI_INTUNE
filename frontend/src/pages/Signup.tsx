import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Mail, Lock, User, Phone, Shield, ArrowRight, Home, CheckCircle, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { createWorker } from "tesseract.js"; 
import { API } from "@/lib/api";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  const { toast } = useToast();
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);   // NEW
  const [ocrLoading, setOcrLoading]   = useState(false);               // NEW

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 👇 ADD just these two helpers at the top of the component file (after imports)
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Request failed");
  return data as T;
}

/* 🧠  OCR: detectGender() ------------------------------------------- */
async function detectGender(file: File): Promise<"Male" | "Female" | "Unknown"> {
  const worker = await createWorker("eng", 1, {
    logger: () => {}                // mute console spam
  });
  const {
    data: { text }
  } = await worker.recognize(file);
  await worker.terminate();

  const upper = text.toUpperCase();
  if (upper.includes("FEMALE")) return "Female";
  if (upper.includes("MALE")) return "Male";
  
  return "Unknown";
}

// ⬇️  REPLACE ONLY THESE TWO FUNCTIONS  ───────────────────────────
const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Front-end validations
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      toast({
        title: "Agreement required",
        description: "Please agree to the terms and privacy policy to continue.",
        variant: "destructive"
      });
      return;
    }

     if (!aadhaarFile) {
      toast({ title: "Aadhaar image missing", description: "Please upload your Aadhaar JPG before continuing.", variant: "destructive" });
      return;
     }

    // try {
    //   /* ↳ CALL THE EXPRESS API */
    //   type Resp = { token: string; name: string; email: string; _id: string };
    //   const data = await request<Resp>("/auth/register", {
    //     name: formData.email.split("@")[0], // until you add a Name field
    //     email: formData.email,
    //     password: formData.password
    //   });

    //   localStorage.setItem("token", data.token);

    //   toast({
    //     title: "Account created successfully! 🎉",
    //     description: "Redirecting to dashboard…"
    //   });

    //   // ✅ Redirect to home after signup
    //   navigate("/");
    // } catch (err: any) {
    //   toast({
    //     title: "Signup failed",
    //     description: err.message,
    //     variant: "destructive"
    //   });
    // }

     try {
      setOcrLoading(true);
      const gender = await detectGender(aadhaarFile);

      if (gender === "Male") {
        toast({
          title: "Signup blocked 🚫",
          description: "At the moment InTune is only open to female students.",
          variant: "destructive"
        });
        return;
      }
      if (gender === "Unknown") {
        toast({
          title: "Couldn’t verify gender",
          description: "The image was unclear. Please upload a higher-quality photo.",
          variant: "destructive"
        });
        return;
      }
    } catch (err) {
      toast({
        title: "OCR failed",
        description: "Could not read the Aadhaar image. Try again or contact support.",
        variant: "destructive"
      });
      return;
    } finally {
      setOcrLoading(false);
    }

    /* ↳ If we’re here gender = Female – continue with your existing API call */
    try {
      type Resp = { token: string; name: string; email: string; _id: string };
      const data = await request<Resp>("/auth/register", {
        name: formData.email.split("@")[0],
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem("token", data.token);
      toast({ title: "Account created successfully! 🎉", description: "Redirecting to dashboard…" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    }
  };
  
const handleGoogleSignup = () => {
  toast({
    title: "Google Signup",
    description: "Google OAuth not wired yet – coming soon!"
  });
};

  const signupBenefits = [
    "Get your unique anonymous ID",
    "Advanced AI voice matching",
    "Anonymous chat system",
    "Aadhaar-verified security",
    "StyleMatch room decoration",
    "GuideBot conflict resolution"
  ];

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />
      
      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Back to Home */}
          <Link 
            to="/" 
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-smooth"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits Column */}
            <div className="lg:col-span-1">
              <Card className="bg-card-gradient border-border/50 shadow-card h-fit">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Why Join InTune?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {signupBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-border">
                    <Badge variant="secondary" className="w-full justify-center">
                      🎯 97% Match Success Rate
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Signup Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card-gradient border-border/50 shadow-warm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-primary">
                    Join InTune Today
                  </CardTitle>
                  <CardDescription>
                    Create your account and get your unique anonymous ID to start matching
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Google Signup */}
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full" 
                    onClick={handleGoogleSignup}
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
                        Or create account with email
                      </span>
                    </div>
                  </div>

                  
                  {/* ⬇️ New Aadhaar upload field */}
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Upload Aadhaar JPG</Label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="aadhaar"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => setAadhaarFile(e.target.files?.[0] ?? null)}
                        className="pl-10"
                        required
                      />
                    </div>
                    {ocrLoading && (
                      <p className="text-xs text-muted-foreground">Analysing image…</p>
                    )}
                  </div>

                  {/* Email Signup Form */}
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Create strong password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Agreements */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="terms" 
                          // checked={formData.agreeToTerms}
                          // onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                        />
                        <label htmlFor="terms" className="text-sm text-muted-foreground">
                          I agree to the{" "}
                          <Link to="/terms" className="text-primary hover:text-primary/80">
                            Terms & Conditions
                          </Link>
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="privacy" 
                          checked={formData.agreeToPrivacy}
                          onCheckedChange={(checked) => handleInputChange('agreeToPrivacy', checked as boolean)}
                        />
                        <label htmlFor="privacy" className="text-sm text-muted-foreground">
                          I agree to the{" "}
                          <span className="text-primary hover:text-primary/80">
  Privacy Policy
</span>

                        </label>
                      </div>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full">
                      Create Account & Get Anonymous ID
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>

                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                      Sign in here
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <div className="mt-6 text-center text-xs text-muted-foreground">
                🔒 Your data is protected with Aadhaar verification, anonymous IDs, and end-to-end encryption.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;