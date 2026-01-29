import { Plus, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

interface Design {
  id: string;
  title: string;
  thumbnail?: string;
  lastEdited: string;
}

const mockDesigns: Design[] = [
  { id: "1", title: "Marketing Presentation", lastEdited: "2 hours ago" },
  { id: "2", title: "Instagram Story", lastEdited: "Yesterday" },
  { id: "3", title: "Business Card", lastEdited: "3 days ago" },
  { id: "4", title: "YouTube Thumbnail", lastEdited: "1 week ago" },
];

const RecentDesigns = () => {
  return (
    <section className="px-8 py-10 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent designs</h2>
          <button className="text-sm text-primary font-medium hover:underline">
            See all
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Create new design card */}
          <Link 
            to="/editor"
            className="aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Create new</span>
          </Link>
          
          {mockDesigns.map((design) => (
            <Link key={design.id} to="/editor" className="group">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-muted overflow-hidden relative">
                <button 
                  className="absolute top-2 right-2 p-1.5 bg-card/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVertical className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium text-foreground truncate">{design.title}</h3>
                <p className="text-xs text-muted-foreground">{design.lastEdited}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentDesigns;
