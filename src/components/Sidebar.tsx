import { useState, useRef, useEffect } from "react";
import { Plus, Home, FolderKanban, LayoutTemplate, Palette, Sparkles, MoreHorizontal, Bell, Menu, LogIn, LogOut, User, Trash2, X, Star } from "lucide-react";
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleItemClick = (item: typeof menuItems[0]) => {
    navigate(item.path);
  };

  const handleMoreItemClick = (path: string) => {
    if (path === "/settings") {
      navigate(path);
    } else {
      toast({
        title: "Coming Soon",
        description: "This feature is under development.",
      });
    }
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

  const sidebarRecentDesigns = [
    { id: 1, title: "Marketing Presentation", icon: "MP" },
    { id: 2, title: "Instagram Story", icon: "IS" },
    { id: 3, title: "Business Card", icon: "BC" },
    { id: 4, title: "Untitled Design", imageUrl: "/placeholder.svg" },
    { id: 5, title: "Purple Minimalist", icon: "PM" },
  ];

  return (
    <>
      <aside className="hidden md:flex w-20 bg-sidebar border-r border-sidebar-border flex-col items-center py-4 h-screen fixed left-0 top-0 z-50 bg-white">
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-muted rounded-lg mb-4 text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex-1 flex flex-col gap-1 w-full px-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={cn(
                "sidebar-item relative flex flex-col items-center justify-center p-2 rounded-lg transition-all",
                item.isCreate && "bg-primary text-primary-foreground hover:bg-primary/90 mb-4 shadow-md",
                activeItem === item.id && !item.isCreate && "bg-secondary text-primary font-semibold"
              )}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.hasBadge && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-category-orange rounded-full border-2 border-white" />
              )}
            </button>
          ))}

          {/* More Options Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary text-muted-foreground mt-2">
                <MoreHorizontal className="w-6 h-6" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48 ml-2">
              {moreMenuItems.map((item) => (
                <DropdownMenuItem key={item.id} onClick={() => handleMoreItemClick(item.path)}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex flex-col gap-4 mt-auto w-full px-2 items-center pb-4">
          <button
            className="p-2 text-muted-foreground hover:bg-secondary rounded-full"
            onClick={() => toast({ title: "Notifications", description: "No new notifications." })}
          >
            <Bell className="w-6 h-6" />
          </button>

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
                  <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56 ml-2">
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
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <LogIn className="w-4 h-4" />
            </Link>
          )}
        </div>
      </aside>

      {/* Expanded Menu Drawer */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-20 h-screen w-80 bg-[#f8f9fc] border-r shadow-xl transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">DesignAI</span>
          </div>

          {/* Star Promo Box */}
          <div className="bg-white p-4 rounded-lg border border-dashed border-primary/30 mb-8 relative">
            <button className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-sm mb-1">Star designs and folders</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Star your most important items by selecting the <span className="inline-block"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /></span> star icon on a design or folder.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 ml-1">Recent designs</h3>
            <div className="space-y-1">
              {sidebarRecentDesigns.map((design) => (
                <div key={design.id} className="flex items-center gap-3 p-2 hover:bg-white hover:shadow-sm rounded-md cursor-pointer group transition-all">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {design.icon || <div className="w-full h-full bg-cover rounded" style={{ backgroundImage: `url(${design.imageUrl})` }} />}
                  </div>
                  <span className="text-sm text-gray-700 font-medium truncate group-hover:text-primary transition-colors">{design.title}</span>
                </div>
              ))}
              <button className="w-full text-left text-sm text-primary font-medium hover:underline p-2 mt-2">
                See all
              </button>
            </div>
          </div>

          <div className="mt-auto border-t pt-4">
            <button className="flex items-center gap-3 p-2 w-full hover:bg-white hover:text-red-600 hover:shadow-sm rounded-md cursor-pointer transition-all text-gray-600">
              <Trash2 className="w-5 h-5" />
              <span className="text-sm font-medium">Trash</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
