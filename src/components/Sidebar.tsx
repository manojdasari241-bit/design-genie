import { useState, useRef, useEffect } from "react";
import { Plus, Home, FolderKanban, LayoutTemplate, Palette, Sparkles, MoreHorizontal, Bell, Menu, LogIn, LogOut, User, Trash2, X, Star, Settings, Moon, HelpCircle, Grid, CreditCard, ShoppingBag, Monitor, Users, ChevronRight } from "lucide-react";
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
      <aside className="hidden md:flex w-20 bg-sidebar border-r border-sidebar-border flex-col items-center py-4 h-screen fixed left-0 top-0 z-50">
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
                  <Avatar className="w-9 h-9 cursor-pointer hover:opacity-80 border-2 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-xs font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-80 ml-2 p-0 overflow-hidden shadow-xl border-border/50">
                {/* Account Section */}
                <div className="p-4 flex items-center gap-3 hover:bg-sidebar-accent/50 cursor-pointer transition-colors border-b border-border/50" onClick={() => navigate("/profile")}>
                  <Avatar className="w-10 h-10 border border-border shrink-0">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-foreground">{profile?.display_name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>

                {/* Teams Section */}
                <div className="p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Teams</p>
                  <button className="w-full flex items-center justify-center gap-2 border border-border rounded-md py-2 hover:bg-secondary transition-colors text-sm font-medium text-foreground">
                    <Users className="w-4 h-4" />
                    Create team
                  </button>
                </div>

                <DropdownMenuSeparator className="my-0" />

                {/* Menu Options */}
                <div className="py-2">
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer" onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer flex items-center justify-between">
                    <div className="flex items-center">
                      <Moon className="w-4 h-4 mr-3 text-muted-foreground" />
                      Theme
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer" onClick={() => toast({ title: "Coming Soon", description: "Help resources are on the way." })}>
                    <HelpCircle className="w-4 h-4 mr-3 text-muted-foreground" />
                    Help and resources
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer flex items-center justify-between" onClick={() => navigate("/editor?tool=ai")}>
                    <div className="flex items-center">
                      <Grid className="w-4 h-4 mr-3 text-muted-foreground" />
                      Advanced tools
                    </div>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">Beta</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                    <CreditCard className="w-4 h-4 mr-3 text-muted-foreground" />
                    Plans and pricing
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                    <ShoppingBag className="w-4 h-4 mr-3 text-muted-foreground" />
                    Purchase history
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-0" />

                <div className="py-2">
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                    <Monitor className="w-4 h-4 mr-3 text-muted-foreground" />
                    Get the Canva Apps
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-0" />

                <div className="py-2">
                  <DropdownMenuItem onClick={handleSignOut} className="px-4 py-2.5 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="w-4 h-4 mr-3" />
                    Log out
                  </DropdownMenuItem>
                </div>

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
          "fixed top-0 left-20 h-screen w-80 bg-background border-r shadow-xl transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">DesignAI</span>
          </div>

          {/* Star Promo Box */}
          <div className="bg-card text-card-foreground p-4 rounded-lg border border-dashed border-primary/30 mb-8 relative">
            <button className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-sm mb-1">Star designs and folders</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Star your most important items by selecting the <span className="inline-block"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /></span> star icon on a design or folder.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 ml-1">Recent designs</h3>
            <div className="space-y-1">
              {sidebarRecentDesigns.map((design) => (
                <div key={design.id} className="flex items-center gap-3 p-2 hover:bg-accent hover:text-accent-foreground hover:shadow-sm rounded-md cursor-pointer group transition-all">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {design.icon || <div className="w-full h-full bg-cover rounded" style={{ backgroundImage: `url(${design.imageUrl})` }} />}
                  </div>
                  <span className="text-sm text-foreground font-medium truncate group-hover:text-primary transition-colors">{design.title}</span>
                </div>
              ))}
              <button className="w-full text-left text-sm text-primary font-medium hover:underline p-2 mt-2">
                See all
              </button>
            </div>
          </div>

          <div className="mt-auto border-t pt-4">
            <button className="flex items-center gap-3 p-2 w-full hover:bg-destructive/10 hover:text-destructive rounded-md cursor-pointer transition-all text-muted-foreground">
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
