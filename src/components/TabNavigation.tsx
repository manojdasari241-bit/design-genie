import { FolderKanban, LayoutTemplate, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "designs", label: "Your designs", icon: FolderKanban },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "ai", label: "DesignAI", icon: Sparkles },
];

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2",
            activeTab === tab.id
              ? "bg-white text-primary border-white shadow-md font-semibold"
              : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40"
          )}
        >
          <tab.icon className="w-4 h-4" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
