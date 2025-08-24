// import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ShareMomentSection from "@/components/ShareMomentSection";
import SuccessStories from "@/components/SuccessStories";
import CommunityStats from "@/components/CommunityStats";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const RoomGallery = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ShareMomentSection />
      <SuccessStories />
      <CommunityStats />
      <Footer />
    </div>
  );
};

export default RoomGallery;