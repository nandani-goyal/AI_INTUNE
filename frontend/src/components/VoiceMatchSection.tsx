
import OmniWidget from "./omniWidget";
import VoiceMatchCard from "./VoiceMatchCard";
import { toast } from "@/hooks/use-toast";

const VoiceMatchSection = () => {
  const handleStartChat = (cardType: string) => {
    try {
      
      toast({
      title: "Voice Match Started",
      description: `Starting ${cardType} voice matching session...`,
    });
    console.log(`Starting chat for: ${cardType}`);
    } catch (error) {
      
    }
    
  };

  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-light-cream via-creamy-beige to-soft-sand overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-warm-brown rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-soft-sand rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-warm-brown-dark rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-creamy-beige rounded-full blur-xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-warm-brown mb-6 drop-shadow-sm">
            Voice Match
          </h1>
          <p className="text-xl text-muted-text max-w-3xl mx-auto leading-relaxed">
            Let our AI assistant understand your preferences through natural conversation. 
            Complete the required steps to find your perfect match, and boost accuracy with our optional enhancement.
          </p>
        </div>

        {/* Voice Match Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Roommate Preference - Required */}
          <VoiceMatchCard
            title="Roommate Preferences"
            description="Share your ideal roommate qualities, lifestyle preferences, and compatibility factors through a natural conversation with our AI assistant."
            isRequired={true}
            icon="users"
            onStartChat={() => handleStartChat("Roommate Preferences")}
          />

          {/* Room Preference - Required */}
          <VoiceMatchCard
            title="Room Preferences"
            description="Describe your perfect living space, location preferences, amenities, and budget requirements in a conversational format."
            isRequired={true}
            icon="home"
            onStartChat={() => handleStartChat("Room Preferences")}
          />

          {/* Lifestyle & Habits - Optional */}
          <VoiceMatchCard
            title="Lifestyle & Habits"
            description="Optional deep-dive into your daily routines, hobbies, and personal habits to significantly improve matching accuracy."
            isRequired={false}
            isOptional={true}
            accuracyBoost={true}
            icon="star"
            onStartChat={() => handleStartChat("Lifestyle & Habits")}
          />
        </div>

        {/* Progress Indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-warm-white rounded-full px-6 py-3 shadow-lg border border-soft-sand backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-warm-brown"></div>
              <span className="text-sm text-muted-text font-medium">Required</span>
            </div>
            <div className="w-px h-4 bg-soft-sand"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-soft-sand"></div>
              <span className="text-sm text-muted-text font-medium">Optional</span>
            </div>
          </div>
        </div>
      </div>
      <OmniWidget></OmniWidget>
     </section>
  );
};

export default VoiceMatchSection;
