import {
    ChevronRight, Play, Heart, MoreHorizontal, HelpCircle,
    Presentation, Image as ImageIcon, FileText, Mail, Hexagon,
    StickyNote, Instagram, Video, MailOpen, MonitorPlay, Smartphone
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "@/context/FavoritesContext";

interface TemplateCardProps {
    id?: string;
    title: string;
    category: string;
    type?: "image" | "video";
    color?: string;
}

const TemplateCard = ({ id, title, category, type = "image", color = "bg-purple-100" }: TemplateCardProps) => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const templateId = id || `feed-${title.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="group relative flex-shrink-0 w-[240px] cursor-pointer">
            <div className={`aspect-[4/3] rounded-xl ${color} overflow-hidden relative transition-all duration-300 group-hover:shadow-lg`}>
                {/* Placeholder specific graphics/gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-black/5" />

                {/* Mockup Content */}
                <div className="absolute inset-4 flex flex-col gap-2 opacity-50">
                    <div className="w-full h-1/2 bg-white/40 rounded-sm" />
                    <div className="w-2/3 h-2 bg-black/10 rounded-full" />
                    <div className="w-1/2 h-2 bg-black/10 rounded-full" />
                </div>

                {type === "video" && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm z-10">
                        <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                )}

                {/* Hover actions */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(templateId);
                        }}
                        className={`p-1.5 rounded-md shadow-sm transition-colors ${isFavorite(templateId)
                            ? "bg-red-500 text-white"
                            : "bg-white/90 hover:bg-white text-muted-foreground hover:text-red-500"
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${isFavorite(templateId) ? "fill-current" : ""}`} />
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
    )
};

interface CategoryCardProps {
    label: string;
    color: string;
    icon: React.ElementType;
    onClick?: () => void;
}

const CategoryCard = ({ label, color, icon: Icon, onClick }: CategoryCardProps) => (
    <div
        onClick={onClick}
        className={`flex-shrink-0 w-[160px] h-[100px] rounded-xl ${color} p-4 relative overflow-hidden cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200 group`}
    >
        <span className="font-semibold text-foreground/80 relative z-10">{label}</span>
        <div className="absolute -bottom-2 -right-2 transform rotate-12 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon className="w-16 h-16" />
        </div>
        <ChevronRight className="absolute bottom-3 right-3 w-4 h-4 text-foreground/40 z-10" />
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

// Category to filter mapping
const categoryMappings: Record<string, string> = {
    "Presentation": "Presentations",
    "Poster": "Print",
    "Resume": "Print",
    "Email": "Marketing",
    "Logo": "Marketing",
    "Flyer": "Print",
    "Instagram Post": "Social Media",
    "Instagram Story": "Social Media",
    "Video": "Videos",
    "Invitation": "Print",
};

// Template data with categories
const allTemplates = [
    { id: "feed-1", title: "Minimalist Resume", category: "Resumes", color: "bg-stone-100" },
    { id: "feed-2", title: "Modern Business Corp", category: "Logos", color: "bg-slate-100" },
    { id: "feed-3", title: "Aesthetic Layout", category: "Social Media", color: "bg-zinc-100" },
    { id: "feed-4", title: "Pure Design Studio", category: "Marketing", color: "bg-neutral-100" },
    { id: "feed-5", title: "Fashion Collection", category: "Presentations", color: "bg-amber-50" },
    { id: "feed-6", title: "Tech Startup Pitch", category: "Presentations", color: "bg-blue-50" },
    { id: "feed-7", title: "Diwali Festival", category: "Social Media", color: "bg-red-100" },
    { id: "feed-8", title: "Freedom Sale", category: "Posters", color: "bg-orange-50" },
    { id: "feed-9", title: "Wedding Invitation", category: "Invitations", color: "bg-rose-50" },
    { id: "feed-10", title: "Hiring Now", category: "Social Media", color: "bg-blue-50" },
    { id: "feed-11", title: "Summer Menu", category: "Flyers", color: "bg-yellow-50" },
    { id: "feed-12", title: "Promo Video Intro", category: "Videos", color: "bg-purple-100", type: "video" as const },
    { id: "feed-13", title: "Data Insights", category: "Infographics", color: "bg-emerald-50" },
    { id: "feed-14", title: "Professional Card", category: "Business Cards", color: "bg-gray-100" },
    { id: "feed-15", title: "Brand Guidelines", category: "Marketing", color: "bg-indigo-50" },
];

interface TemplatesFeedProps {
    selectedFilter?: string;
}

const TemplatesFeed = ({ selectedFilter = "All" }: TemplatesFeedProps) => {
    const navigate = useNavigate();

    // Filter templates based on selected filter
    const filteredTemplates = selectedFilter === "All"
        ? allTemplates
        : allTemplates.filter(t => t.category === selectedFilter);

    const trendingTemplates = selectedFilter === "All"
        ? allTemplates.slice(6, 11)
        : allTemplates.filter(t => t.category === selectedFilter).slice(0, 5);

    const handleCategoryClick = (label: string) => {
        const mappedCategory = categoryMappings[label] || label;
        navigate(`/templates?category=${encodeURIComponent(mappedCategory)}`);
    };

    return (
        <div className="px-8 py-8 space-y-12 pb-20">

            {/* Explore templates */}
            <section>
                <h2 className="text-xl font-bold text-foreground mb-6">Explore templates</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    <CategoryCard label="Presentation" icon={Presentation} color="bg-orange-100" onClick={() => handleCategoryClick("Presentation")} />
                    <CategoryCard label="Poster" icon={ImageIcon} color="bg-purple-100" onClick={() => handleCategoryClick("Poster")} />
                    <CategoryCard label="Resume" icon={FileText} color="bg-blue-100" onClick={() => handleCategoryClick("Resume")} />
                    <CategoryCard label="Email" icon={Mail} color="bg-indigo-100" onClick={() => handleCategoryClick("Email")} />
                    <CategoryCard label="Logo" icon={Hexagon} color="bg-yellow-100" onClick={() => handleCategoryClick("Logo")} />
                    <CategoryCard label="Flyer" icon={StickyNote} color="bg-pink-100" onClick={() => handleCategoryClick("Flyer")} />
                    <CategoryCard label="Instagram Post" icon={Instagram} color="bg-red-50" onClick={() => handleCategoryClick("Instagram Post")} />
                    <CategoryCard label="Instagram Story" icon={Smartphone} color="bg-pink-50" onClick={() => handleCategoryClick("Instagram Story")} />
                    <CategoryCard label="Video" icon={Video} color="bg-emerald-50" onClick={() => handleCategoryClick("Video")} />
                    <CategoryCard label="Invitation" icon={MailOpen} color="bg-violet-100" onClick={() => handleCategoryClick("Invitation")} />
                </div>
            </section>

            {/* Filtered Templates Section */}
            <section>
                <SectionHeader title={selectedFilter === "All" ? "Inspired by your designs" : `${selectedFilter} Templates`} />
                {filteredTemplates.length > 0 ? (
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {filteredTemplates.slice(0, 6).map((template, index) => (
                            <TemplateCard
                                key={`${template.id}-${index}`}
                                id={template.id}
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
                    <Link to="/templates?category=Social%20Media" className="flex-shrink-0 w-[300px] h-[160px] rounded-xl bg-gradient-to-r from-category-orange to-category-pink p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all">
                        <h3 className="font-bold text-lg mb-1">Celebrate</h3>
                        <p className="text-white/90 text-sm">Indian heritage</p>
                        <div className="absolute bottom-4 right-4 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <span className="text-xs font-bold">New Collection</span>
                        </div>
                    </Link>

                    <Link to="/templates?category=Marketing" className="flex-shrink-0 w-[300px] h-[160px] rounded-xl bg-gradient-to-r from-category-green to-category-teal p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all">
                        <h3 className="font-bold text-lg mb-1">Money talks</h3>
                        <p className="text-white/90 text-sm">made easy</p>
                        <div className="absolute bottom-4 right-4 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <span className="text-xs font-bold">Finance Templates</span>
                        </div>
                    </Link>

                    <Link to="/templates?category=Social%20Media" className="flex-shrink-0 w-[300px] h-[160px] rounded-xl bg-gradient-to-r from-category-pink to-category-purple p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all">
                        <h3 className="font-bold text-lg mb-1">Vacation</h3>
                        <p className="text-white/90 text-sm">vibes are on</p>
                    </Link>
                </div>
            </section>

            {/* Trending near you */}
            <section>
                <SectionHeader title="Trending near you" />
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {trendingTemplates.map((template, index) => (
                        <TemplateCard
                            key={`trending-${template.id}-${index}`}
                            id={template.id}
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
