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
            "tab-button flex items-center gap-2",
            activeTab === tab.id && "tab-button-active"
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
