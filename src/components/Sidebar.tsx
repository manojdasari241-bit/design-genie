import { Plus, Home, FolderKanban, LayoutTemplate, Palette, Sparkles, MoreHorizontal, Bell, Menu, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { id: "create", icon: Plus, label: "Create", isCreate: true, path: "/editor" },
  { id: "home", icon: Home, label: "Home", path: "/" },
  { id: "projects", icon: FolderKanban, label: "Projects", path: "/projects" },
  { id: "templates", icon: LayoutTemplate, label: "Templates", path: "/templates" },
  { id: "brand", icon: Palette, label: "Brand", hasBadge: true, path: "/brand" },
  { id: "ai", icon: Sparkles, label: "DesignAI", path: "/editor?tool=ai" },
];

const moreMenuItems = [
  { id: "settings", label: "Settings", path: "/settings" },
  { id: "help", label: "Help & Support", path: "/help" },
  { id: "feedback", label: "Send Feedback", path: "/feedback" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, loading } = useAuth();
  const { toast } = useToast();

  const handleItemClick = (item: typeof menuItems[0]) => {
    navigate(item.path);
  };

  const handleMoreItemClick = (path: string) => {
    toast({
      title: "Coming Soon",
      description: "This feature is under development.",
    });
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate("/");
    }
  };

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/editor") return "create";
    if (path === "/templates") return "templates";
    if (path === "/projects") return "projects";
    if (path === "/brand") return "brand";
    return "";
  };

  const activeItem = getActiveItem();

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
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

        {/* More Options Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="sidebar-item mt-2">
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-xs font-medium">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48">
            {moreMenuItems.map((item) => (
              <DropdownMenuItem key={item.id} onClick={() => handleMoreItemClick(item.path)}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <div className="flex flex-col gap-2 mt-auto pt-4 w-full px-2">
        {/* Notifications */}
        <button 
          className="sidebar-item"
          onClick={() => toast({ title: "Notifications", description: "No new notifications." })}
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* User Profile / Login */}
        {loading ? (
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse mx-auto" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mx-auto focus:outline-none">
                <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{profile?.display_name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link 
            to="/login"
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm mx-auto hover:bg-primary/90 transition-colors"
          >
            <LogIn className="w-5 h-5" />
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
