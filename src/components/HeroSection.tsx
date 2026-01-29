import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import TabNavigation from "./TabNavigation";
import CategoryIcon from "./CategoryIcon";
import {
  Presentation,
  Heart,
  Video,
  Printer,
  FileText,
  PenTool,
  Table2,
  Globe,
  Maximize2,
  Upload,
  MoreHorizontal
} from "lucide-react";

const categories = [
  { icon: Presentation, label: "Presentation", bgColor: "bg-white", iconColor: "text-category-orange" },
  { icon: Heart, label: "Social media", bgColor: "bg-white", iconColor: "text-category-pink" },
  { icon: Video, label: "Video", bgColor: "bg-white", iconColor: "text-category-red" },
  { icon: Printer, label: "Printables", bgColor: "bg-white", iconColor: "text-category-blue" },
  { icon: FileText, label: "Doc", bgColor: "bg-white", iconColor: "text-category-purple" },
  { icon: PenTool, label: "Whiteboard", bgColor: "bg-white", iconColor: "text-category-cyan" },
  { icon: Table2, label: "Sheet", bgColor: "bg-white", iconColor: "text-category-green" },
  { icon: Globe, label: "Website", bgColor: "bg-white", iconColor: "text-category-purple" },
  { icon: Maximize2, label: "Custom size", bgColor: "bg-white/90", iconColor: "text-gray-600" },
  { icon: Upload, label: "Upload", bgColor: "bg-white/90", iconColor: "text-gray-600" },
  { icon: MoreHorizontal, label: "More", bgColor: "bg-white/90", iconColor: "text-gray-600" },
];

const templateFilters = [
  { label: "Republic Day", icon: "🇮🇳" },
  { label: "Happy Birthday", icon: "🎂" },
  { label: "Print", icon: "🖨️" },
  { label: "Business", icon: "💼" },
  { label: "Republic Day India", icon: "🇮🇳" },
  { label: "Valentine's Day", icon: "❤️" },
];

interface HeroSectionProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const HeroSection = ({ activeTab = "designs", onTabChange = () => { } }: HeroSectionProps) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/editor?type=${encodeURIComponent(category)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/templates?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <section className="gradient-hero py-12 px-8 transition-all duration-500 ease-in-out">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-white drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
          What will you design today?
        </h1>

        <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />

        <form onSubmit={handleSearch} className="mt-6 mb-8">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder={activeTab === "templates" ? "Search millions of templates" : "Search designs, folders and uploads"}
          />
        </form>

        {/* Fixed height container to prevent layout shift on tab change */}
        <div className="min-h-[120px] flex items-start justify-center mt-6">
          {activeTab === "designs" ? (
            <div className="flex flex-wrap items-center justify-center gap-6 animate-in fade-in duration-300">
              {categories.map((category) => (
                <CategoryIcon
                  key={category.label}
                  icon={category.icon}
                  label={category.label}
                  bgColor={category.bgColor}
                  iconColor={category.iconColor}
                  onClick={() => handleCategoryClick(category.label)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3 animate-in fade-in duration-300">
              {templateFilters.map((filter) => (
                <button
                  key={filter.label}
                  className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-gray-700 text-sm font-medium transition-all shadow-sm flex items-center gap-2"
                >
                  <span>{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
