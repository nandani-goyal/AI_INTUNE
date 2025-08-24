import { useState } from "react";
import { Download, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GeneratedResultsProps {
  generatedImage: string | null;
  isGenerating: boolean;
}

const GeneratedResults = ({ generatedImage, isGenerating }: GeneratedResultsProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `styled-room-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Styled Room',
          text: 'Check out my AI-generated room design!',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share");
    }
  };

  const handleRating = (newRating: number) => {
    setRating(newRating);
    toast.success(`You rated this design ${newRating} out of 5 hearts!`);
  };

  if (isGenerating) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Generated Result</h3>
        <div className="bg-muted rounded-lg p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-brand-brown border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating your styled room...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!generatedImage) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Generated Result</h3>
      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative group">
          <img
            src={generatedImage}
            alt="Generated styled room"
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AI Generated Design</span>
            <span className="text-xs text-brand-brown font-medium px-2 py-1 bg-brand-warm rounded-full">
              Style Match ✨
            </span>
          </div>

          {/* Heart Rating System */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Rate this design:</p>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRating(star)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Heart
                    className={`w-6 h-6 transition-colors duration-200 ${
                      star <= (hoveredRating || rating)
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground hover:text-red-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating}/5 hearts
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
                <Button size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedResults;