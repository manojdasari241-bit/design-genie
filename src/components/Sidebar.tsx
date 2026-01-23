import { Plus, Home, FolderKanban, LayoutTemplate, Palette, Sparkles, MoreHorizontal, Bell, Menu, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const menuItems = [
  { id: "create", icon: Plus, label: "Create", isCreate: true, path: "/editor" },
  { id: "home", icon: Home, label: "Home", path: "/" },
  { id: "projects", icon: FolderKanban, label: "Projects", path: "/" },
  { id: "templates", icon: LayoutTemplate, label: "Templates", path: "/templates" },
  { id: "brand", icon: Palette, label: "Brand", hasBadge: true, path: "/" },
  { id: "ai", icon: Sparkles, label: "DesignAI", path: "/editor" },
];

const Sidebar = ({ activeItem, onItemClick }: SidebarProps) => {
  const navigate = useNavigate();

  const handleItemClick = (item: typeof menuItems[0]) => {
    onItemClick(item.id);
    navigate(item.path);
  };

  return (
    <aside className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 h-screen fixed left-0 top-0 z-50">
      <button className="p-2 hover:bg-sidebar-accent rounded-lg mb-4 text-sidebar-foreground">
        <Menu className="w-5 h-5" />
      </button>

      <nav className="flex-1 flex flex-col gap-1 w-full px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={cn(
              "sidebar-item relative",
              item.isCreate && "bg-primary text-primary-foreground hover:bg-primary/90 mb-2",
              activeItem === item.id && !item.isCreate && "sidebar-item-active"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
            {item.hasBadge && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-category-orange rounded-full" />
            )}
          </button>
        ))}

        <button className="sidebar-item mt-auto">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </nav>

      <div className="flex flex-col gap-2 mt-auto pt-4 w-full px-2">
        <button className="sidebar-item">
          <Bell className="w-5 h-5" />
        </button>
        <Link 
          to="/login"
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm mx-auto hover:bg-primary/90 transition-colors"
        >
          <LogIn className="w-5 h-5" />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
