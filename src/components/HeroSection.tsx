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
  { icon: Presentation, label: "Presentation", bgColor: "bg-category-orange/10", iconColor: "text-category-orange" },
  { icon: Heart, label: "Social media", bgColor: "bg-category-pink/10", iconColor: "text-category-pink" },
  { icon: Video, label: "Video", bgColor: "bg-category-red/10", iconColor: "text-category-red" },
  { icon: Printer, label: "Printables", bgColor: "bg-category-blue/10", iconColor: "text-category-blue" },
  { icon: FileText, label: "Doc", bgColor: "bg-category-purple/10", iconColor: "text-category-purple" },
  { icon: PenTool, label: "Whiteboard", bgColor: "bg-category-cyan/10", iconColor: "text-category-cyan" },
  { icon: Table2, label: "Sheet", bgColor: "bg-category-green/10", iconColor: "text-category-green" },
  { icon: Globe, label: "Website", bgColor: "bg-category-purple/10", iconColor: "text-category-purple" },
  { icon: Maximize2, label: "Custom size", bgColor: "bg-muted", iconColor: "text-muted-foreground" },
  { icon: Upload, label: "Upload", bgColor: "bg-muted", iconColor: "text-muted-foreground" },
  { icon: MoreHorizontal, label: "More", bgColor: "bg-muted", iconColor: "text-muted-foreground" },
];

const HeroSection = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("designs");
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    // Navigate to editor with the selected category
    navigate(`/editor?type=${encodeURIComponent(category)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/templates?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <section className="gradient-hero py-12 px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="gradient-text text-4xl md:text-5xl font-bold text-center mb-8">
          What will you design today?
        </h1>
        
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <form onSubmit={handleSearch} className="mt-6">
          <SearchBar value={searchValue} onChange={setSearchValue} />
        </form>
        
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
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
      </div>
    </section>
  );
};

export default HeroSection;
