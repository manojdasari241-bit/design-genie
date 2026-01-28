import { Home, FolderKanban, LayoutTemplate, Plus, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const MobileNav = () => {
    const location = useLocation();
    const path = location.pathname;

    const items = [
        { id: "home", icon: Home, label: "Home", path: "/" },
        { id: "projects", icon: FolderKanban, label: "Projects", path: "/projects" },
        { id: "create", icon: Plus, label: "Create", path: "/editor", isPrimary: true },
        { id: "templates", icon: LayoutTemplate, label: "Templates", path: "/templates" },
        { id: "menu", icon: User, label: "Menu", path: "/settings" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around z-50 px-2">
            {items.map((item) => (
                <Link
                    key={item.id}
                    to={item.path}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors w-full",
                        path === item.path ? "text-primary" : "text-muted-foreground hover:text-foreground",
                        item.isPrimary && "bg-primary text-primary-foreground rounded-full -mt-6 h-12 w-12 shadow-lg border-4 border-background"
                    )}
                >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default MobileNav;
