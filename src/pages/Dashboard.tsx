import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import TemplatesSection from "@/components/TemplatesSection";
import RecentDesigns from "@/components/RecentDesigns";
import { Sparkles } from "lucide-react";

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState("home");

  const handleSidebarClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeItem={activeItem} onItemClick={handleSidebarClick} />
      
      <main className="flex-1 ml-20">
        {/* Top banner */}
        <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:bg-secondary transition-colors">
            <Sparkles className="w-4 h-4 text-category-orange" />
            <span>Start your trial for free</span>
          </button>
        </div>
        
        <HeroSection />
        <TemplatesSection />
        <RecentDesigns />
      </main>
    </div>
  );
};

export default Dashboard;
