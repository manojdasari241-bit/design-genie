import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Filter } from "lucide-react";
import template1 from "@/assets/template-1.jpg";
import template2 from "@/assets/template-2.jpg";
import template3 from "@/assets/template-3.jpg";
import template4 from "@/assets/template-4.jpg";
import template5 from "@/assets/template-5.jpg";

const categories = [
  "All", "Social Media", "Presentations", "Videos", "Print", "Marketing", "Education"
];

const templates = [
  { id: 1, title: "Celebration Design", category: "Social Media", image: template1 },
  { id: 2, title: "Kite Festival", category: "Social Media", image: template2 },
  { id: 3, title: "Harvest Festival", category: "Print", image: template3 },
  { id: 4, title: "Spring Floral", category: "Marketing", image: template4 },
  { id: 5, title: "Patriotic Theme", category: "Social Media", image: template5 },
  { id: 6, title: "Celebration Design 2", category: "Print", image: template1 },
  { id: 7, title: "Sky Festival", category: "Marketing", image: template2 },
  { id: 8, title: "Autumn Harvest", category: "Education", image: template3 },
];

const Templates = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates = templates.filter(t => 
    (activeCategory === "All" || t.category === activeCategory) &&
    t.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Templates</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pb-4 flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Link
              key={template.id}
              to="/editor"
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-secondary mb-3 relative">
                <img 
                  src={template.image} 
                  alt={template.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-card px-4 py-2 rounded-lg font-medium shadow-lg transition-opacity">
                    Use Template
                  </span>
                </div>
              </div>
              <h3 className="font-medium text-foreground">{template.title}</h3>
              <p className="text-sm text-muted-foreground">{template.category}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Templates;
