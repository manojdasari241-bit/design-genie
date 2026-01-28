import { ChevronRight, Play, Heart, MoreHorizontal, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const TemplateCard = ({ title, category, type = "image", color = "bg-purple-100" }: { title: string, category: string, type?: "image" | "video", color?: string }) => (
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
                    <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1.5 bg-white/90 rounded-md hover:bg-white shadow-sm">
                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
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

const TemplatesFeed = () => {
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

            {/* Inspired by your designs */}
            <section>
                <SectionHeader title="Inspired by your designs" />
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    <TemplateCard title="Minimalist Resume" category="Resume" color="bg-stone-100" />
                    <TemplateCard title="Modern Business Corp" category="Logo" color="bg-slate-100" />
                    <TemplateCard title="Aesthetic Layout" category="Instagram Post" color="bg-zinc-100" />
                    <TemplateCard title="Pure Design Studio" category="Website" color="bg-neutral-100" />
                    <TemplateCard title="Fashion Collection" category="Presentation" color="bg-amber-50" />
                    <TemplateCard title="Tech Startup Pitch" category="Presentation" color="bg-blue-50" />
                </div>
            </section>

            {/* What's new */}
            <section>
                <SectionHeader title="What's new" />
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex-shrink-0 w-[300px] h-[160px] rounded-xl bg-gradient-to-r from-orange-400 to-rose-400 p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                        <h3 className="font-bold text-lg mb-1">Celebrate</h3>
                        <p className="text-white/90 text-sm">Indian heritage</p>
                        <div className="absolute bottom-4 right-4 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <span className="text-xs font-bold">New Collection</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-[300px] h-[160px] rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                        <h3 className="font-bold text-lg mb-1">Money talks</h3>
                        <p className="text-white/90 text-sm">made easy</p>
                        <div className="absolute bottom-4 right-4 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <span className="text-xs font-bold">Finance Templates</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-[300px] h-[160px] rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                        <h3 className="font-bold text-lg mb-1">Vacation</h3>
                        <p className="text-white/90 text-sm">vibes are on</p>
                    </div>
                </div>
            </section>

            {/* Trending near you */}
            <section>
                <SectionHeader title="Trending near you" />
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    <TemplateCard title="Diwali Festival" category="Instagram Post" color="bg-red-100" />
                    <TemplateCard title="Freedom Sale" category="Poster" color="bg-orange-50" />
                    <TemplateCard title="Wedding Invitation" category="Invitation" color="bg-rose-50" />
                    <TemplateCard title="Hiring Now" category="Linkedin Post" color="bg-blue-50" />
                    <TemplateCard title="Summer Menu" category="Menu" color="bg-yellow-50" />
                </div>
            </section>

            {/* Quick Help Button (FAB) */}
            <div className="fixed bottom-8 right-8">
                <button className="w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors animate-in fade-in zoom-in">
                    <HelpCircle className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
};

export default TemplatesFeed;
