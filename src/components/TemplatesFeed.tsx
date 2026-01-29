import { ChevronRight, Play, Heart, MoreHorizontal, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface TemplateCardProps {
  title: string;
  category: string;
  type?: "image" | "video";
  color?: string;
}

const TemplateCard = ({ title, category, type = "image", color = "bg-purple-100" }: TemplateCardProps) => (
    <div className="group relative flex-shrink-0 w-[240px] cursor-pointer">
        <div className={`aspect-[4/3] rounded-xl ${color} overflow-hidden relative transition-all duration-300 group-hover:shadow-lg`}>
            {/* Placeholder specific graphics/gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/5" />

            {type === "video" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-5 h-5 text-white fill-white" />
                </div>
            )}

            {/* Hover actions */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-white/90 rounded-md hover:bg-white shadow-sm">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 bg-white/90 rounded-md hover:bg-white shadow-sm">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>
        </div>
        <div className="mt-3">
            <h3 className="font-medium text-foreground text-sm group-hover:underline">{title}</h3>
            <p className="text-xs text-muted-foreground">{category}</p>
        </div>
    </div>
);

const CategoryCard = ({ label, color, icon }: { label: string, color: string, icon?: string }) => (
    <div className={`flex-shrink-0 w-[160px] h-[100px] rounded-xl ${color} p-4 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}>
        <span className="font-semibold text-foreground/80">{label}</span>
        {icon && (
            <div className="absolute bottom-2 right-2 w-10 h-10 opacity-50">
                {/* Icon placeholder */}
                <div className="w-full h-full bg-current rounded-full opacity-20" />
            </div>
        )}
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border hover:bg-secondary transition-colors">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
    </div>
);

// Template data with categories
const allTemplates = [
  { title: "Minimalist Resume", category: "Resumes", color: "bg-stone-100" },
  { title: "Modern Business Corp", category: "Logos", color: "bg-slate-100" },
  { title: "Aesthetic Layout", category: "Social Media", color: "bg-zinc-100" },
  { title: "Pure Design Studio", category: "Marketing", color: "bg-neutral-100" },
  { title: "Fashion Collection", category: "Presentations", color: "bg-amber-50" },
  { title: "Tech Startup Pitch", category: "Presentations", color: "bg-blue-50" },
  { title: "Diwali Festival", category: "Social Media", color: "bg-red-100" },
  { title: "Freedom Sale", category: "Posters", color: "bg-orange-50" },
  { title: "Wedding Invitation", category: "Invitations", color: "bg-rose-50" },
  { title: "Hiring Now", category: "Social Media", color: "bg-blue-50" },
  { title: "Summer Menu", category: "Flyers", color: "bg-yellow-50" },
  { title: "Promo Video Intro", category: "Videos", color: "bg-purple-100", type: "video" as const },
  { title: "Data Insights", category: "Infographics", color: "bg-emerald-50" },
  { title: "Professional Card", category: "Business Cards", color: "bg-gray-100" },
  { title: "Brand Guidelines", category: "Marketing", color: "bg-indigo-50" },
];

interface TemplatesFeedProps {
  selectedFilter?: string;
}

const TemplatesFeed = ({ selectedFilter = "All" }: TemplatesFeedProps) => {
    // Filter templates based on selected filter
    const filteredTemplates = selectedFilter === "All" 
      ? allTemplates 
      : allTemplates.filter(t => t.category === selectedFilter);
    
    const trendingTemplates = selectedFilter === "All"
      ? allTemplates.slice(6, 11)
      : allTemplates.filter(t => t.category === selectedFilter).slice(0, 5);
    return (
        <div className="px-8 py-8 space-y-12 pb-20">

            {/* Explore templates */}
            <section>
                <h2 className="text-xl font-bold text-foreground mb-6">Explore templates</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    <CategoryCard label="Presentation" color="bg-orange-100" />
                    <CategoryCard label="Poster" color="bg-purple-100" />
                    <CategoryCard label="Resume" color="bg-blue-100" />
                    <CategoryCard label="Email" color="bg-indigo-100" />
                    <CategoryCard label="Logo" color="bg-yellow-100" />
                    <CategoryCard label="Flyer" color="bg-pink-100" />
                    <CategoryCard label="Instagram Post" color="bg-red-50" />
                    <CategoryCard label="Instagram Story" color="bg-pink-50" />
                    <CategoryCard label="Video" color="bg-emerald-50" />
                    <CategoryCard label="Invitation" color="bg-violet-100" />
                </div>
            </section>

            {/* Filtered Templates Section */}
            <section>
                <SectionHeader title={selectedFilter === "All" ? "Inspired by your designs" : `${selectedFilter} Templates`} />
                {filteredTemplates.length > 0 ? (
                  <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                      {filteredTemplates.slice(0, 6).map((template, index) => (
                          <TemplateCard 
                            key={`${template.title}-${index}`}
                            title={template.title} 
                            category={template.category} 
                            color={template.color}
                            type={template.type}
                          />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No templates found for "{selectedFilter}"</p>
                  </div>
                )}
            </section>

            {/* What's new */}
            <section>
                <SectionHeader title="What's new" />
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex-shrink-0 w-[300px] h-[160px] rounded-xl bg-gradient-to-r from-category-orange to-category-pink p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                        <h3 className="font-bold text-lg mb-1">Celebrate</h3>
                        <p className="text-white/90 text-sm">Indian heritage</p>
                        <div className="absolute bottom-4 right-4 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <span className="text-xs font-bold">New Collection</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-[300px] h-[160px] rounded-xl bg-gradient-to-r from-category-green to-category-teal p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                        <h3 className="font-bold text-lg mb-1">Money talks</h3>
                        <p className="text-white/90 text-sm">made easy</p>
                        <div className="absolute bottom-4 right-4 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <span className="text-xs font-bold">Finance Templates</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-[300px] h-[160px] rounded-xl bg-gradient-to-r from-category-pink to-category-purple p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                        <h3 className="font-bold text-lg mb-1">Vacation</h3>
                        <p className="text-white/90 text-sm">vibes are on</p>
                    </div>
                </div>
            </section>

            {/* Trending near you */}
            <section>
                <SectionHeader title="Trending near you" />
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {trendingTemplates.map((template, index) => (
                      <TemplateCard 
                        key={`trending-${template.title}-${index}`}
                        title={template.title} 
                        category={template.category} 
                        color={template.color}
                        type={template.type}
                      />
                    ))}
                </div>
            </section>

            {/* Quick Help Button (FAB) */}
            <div className="fixed bottom-8 right-8">
                <button className="w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors animate-in fade-in zoom-in">
                    <HelpCircle className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
};

export default TemplatesFeed;
