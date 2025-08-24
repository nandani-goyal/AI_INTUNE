import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Sparkles } from "lucide-react";
import ImageUpload from "./ImageUpload";
import StyleSelector from "./StyleSelector";
import GeneratedResults from "./GeneratedResults";
import { toast } from "sonner";
import modernStyle from "@/assets/modern-style.jpg";
import industrialStyle from "@/assets/industrial-style.jpg";
import bohemianStyle from "@/assets/bohemian-style.jpg";
import traditionalStyle from "@/assets/traditional-style.jpg";
import rusticStyle from "@/assets/rustic-style.jpg";
import minimalistStyle from "@/assets/minimalist-style.jpg";

const StyleMatch = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");
  const [decorationType, setDecorationType] = useState<string>("");
  const [additionalRequirements, setAdditionalRequirements] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (image: string) => {
    setUploadedImage(image);
    toast.success("Image uploaded successfully!");
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
    setGeneratedImage(null);
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedStyle || !roomType) {
      toast.error("Please upload an image, select a style, and choose a room type");
      return;
    }

    setIsGenerating(true);
    toast.info("Generating your styled room...");

    try {
      // For demo purposes, we'll generate a new styled image based on the uploaded image
      // In a real implementation, this would call an AI service
      const prompt = `Transform this ${roomType} into ${selectedStyle} style interior design${decorationType ? ` with ${decorationType}` : ''}${additionalRequirements ? `. Additional requirements: ${additionalRequirements}` : ''} Ultra high resolution`;
      
      // Simulate AI generation - in real app, you'd call your AI service here
      setTimeout(() => {
        // Use one of our generated style images as a placeholder for the demo
        const styleImages = {
          modern: modernStyle,
          industrial: industrialStyle, 
          bohemian: bohemianStyle,
          traditional: traditionalStyle,
          rustic: rusticStyle,
          minimalist: minimalistStyle
        };
        
        setGeneratedImage(styleImages[selectedStyle as keyof typeof styleImages] || modernStyle);
        setIsGenerating(false);
        toast.success("Your styled room has been generated!");
      }, 3000);
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to generate image. Please try again.");
    }
  };

  const canGenerate = uploadedImage && selectedStyle && roomType;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-warm relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-brown/5 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-brand-warm/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-brand-brown/8 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-brand-warm/5 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-brown to-brand-brown-dark text-brand-cream py-16 relative">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center mb-6 animate-fade-in">
            <Sparkles className="w-8 h-8 mr-3 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-cream to-brand-warm bg-clip-text text-transparent">
              Style Match
            </h1>
            <Sparkles className="w-8 h-8 ml-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-xl text-brand-warm max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Transform any room with a click. Select a space, choose a style, and watch as AI reimagines your environment.
          </p>
        </div>
        
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-2 h-2 bg-brand-cream rounded-full" />
          <div className="absolute top-20 right-16 w-1 h-1 bg-brand-warm rounded-full" />
          <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-brand-cream rounded-full" />
          <div className="absolute bottom-10 right-10 w-2 h-2 bg-brand-warm rounded-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Options */}
          <div className="space-y-8">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-brand-brown/10 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <ImageUpload
                  uploadedImage={uploadedImage}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                />
              </CardContent>
            </Card>

            {uploadedImage && (
              <>
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-brand-brown/10 bg-white/80 backdrop-blur-sm animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <Wand2 className="w-5 h-5 mr-2 text-brand-brown" />
                      Room Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Select Room Type *
                      </label>
                      <Select value={roomType} onValueChange={setRoomType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="living-room">Living Room</SelectItem>
                          <SelectItem value="bedroom">Bedroom</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="bathroom">Bathroom</SelectItem>
                          <SelectItem value="dining-room">Dining Room</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <StyleSelector
                      selectedStyle={selectedStyle}
                      onStyleChange={setSelectedStyle}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Decoration Preferences
                      </label>
                      <Select value={decorationType} onValueChange={setDecorationType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose decoration type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal Decoration</SelectItem>
                          <SelectItem value="moderate">Moderate Decoration</SelectItem>
                          <SelectItem value="extensive">Extensive Decoration</SelectItem>
                          <SelectItem value="luxury">Luxury Decoration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Enter Additional Requirements
                      </label>
                      <Textarea
                        placeholder="e.g., add a modern lamp, prefer warm lighting, include plants..."
                        value={additionalRequirements}
                        onChange={(e) => setAdditionalRequirements(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Note: 1 credit will be used for generation.
                      </p>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={!canGenerate || isGenerating}
                      className="w-full h-12 text-lg"
    
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-brand-cream border-t-transparent rounded-full mr-3" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-3" />
                          Generate Style Match
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-8">
            {(isGenerating || generatedImage) && (
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-brand-brown/10 bg-white/80 backdrop-blur-sm animate-fade-in">
                <CardContent className="p-6">
                  <GeneratedResults
                    generatedImage={generatedImage}
                    isGenerating={isGenerating}
                  />
                </CardContent>
              </Card>
            )}

            {!uploadedImage && (
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-brand-brown/10 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-brown/10 to-brand-warm/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="w-8 h-8 text-brand-brown animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-brand-brown">Ready to Transform?</h3>
                  <p className="text-muted-foreground">
                    Upload an image of your room to get started with AI-powered style matching.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleMatch;