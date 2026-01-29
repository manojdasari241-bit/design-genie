import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, Filter, Heart } from "lucide-react";
import { templates, templateCategories, getTemplatesByCategory } from "@/data/templateData";
import { useFavorites } from "@/context/FavoritesContext";

const Templates = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { toggleFavorite, isFavorite, favorites } = useFavorites();

  // Update active category when URL changes
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  // Extended categories to include Favorites
  const extendedCategories = ["Favorites", ...templateCategories] as const;

  const getFilteredTemplates = () => {
    if (activeCategory === "Favorites") {
      return templates.filter(t =>
        favorites.includes(t.id) &&
        t.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return getTemplatesByCategory(activeCategory).filter(t =>
      t.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const filteredTemplates = getFilteredTemplates();

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
          {extendedCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
            >
              {category === "Favorites" && <Heart className="w-3.5 h-3.5" />}
              {category}
              {category === "Favorites" && favorites.length > 0 && (
                <span className="ml-1 bg-primary-foreground/20 px-1.5 py-0.5 rounded-full text-xs">
                  {favorites.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {activeCategory === "Favorites"
                ? "No favorite templates yet. Click the heart icon to save templates."
                : "No templates found matching your criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="group relative">
                <Link
                  to={`/editor?templateId=${template.id}`}
                  className="cursor-pointer block"
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

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(template.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all z-10 ${isFavorite(template.id)
                      ? "bg-red-500 text-white"
                      : "bg-white/90 text-muted-foreground hover:bg-white hover:text-red-500"
                    }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(template.id) ? "fill-current" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Templates;
