import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import TemplatesSection from "@/components/TemplatesSection";
import RecentDesigns from "@/components/RecentDesigns";
import TemplatesFeed from "@/components/TemplatesFeed";
import MobileNav from "@/components/MobileNav";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("designs");

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar />
      <MobileNav />

      <main className="flex-1 ml-0 md:ml-20 pb-20 md:pb-0 transition-all duration-300">
        {/* Top banner */}
        <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
          {loading ? (
            <div className="w-16 h-4 bg-muted animate-pulse rounded" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || "User"} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{profile?.display_name || user.email?.split("@")[0]}</span>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-primary hover:underline font-medium">
              Sign in
            </Link>
          )}
          <Link
            to="/signup"
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:bg-secondary transition-colors"
          >
            <Sparkles className="w-4 h-4 text-category-orange" />
            <span>Start your trial for free</span>
          </Link>
        </div>

        <HeroSection activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "templates" ? (
          <TemplatesFeed />
        ) : (
          <>
            <TemplatesSection />
            <RecentDesigns />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
