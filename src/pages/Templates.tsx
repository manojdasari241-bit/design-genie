import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { templates, templateCategories, getTemplatesByCategory } from "@/data/templateData";

const Templates = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates = getTemplatesByCategory(activeCategory).filter(t =>
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
            <span className="text-sm text-muted-foreground">
              {templates.length} templates available
            </span>
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
          {templateCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === category
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
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No templates found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <Link
                key={template.id}
                to={`/editor?templateId=${template.id}`}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-secondary mb-3 relative">
                  <img
                    src={template.thumbnail}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-card px-4 py-2 rounded-lg font-medium shadow-lg transition-opacity">
                      Use Template
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                    {template.subcategory && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white">
                        {template.subcategory}
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white">
                      {template.width}x{template.height}
                    </span>
                  </div>
                </div>
                <h3 className="font-medium text-foreground">{template.title}</h3>
                <p className="text-sm text-muted-foreground">{template.category}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Templates;

