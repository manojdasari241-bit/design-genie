import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
  icon: LucideIcon;
  label: string;
  bgColor: string;
  iconColor: string;
  onClick?: () => void;
}

const CategoryIcon = ({ icon: Icon, label, bgColor, iconColor, onClick }: CategoryIconProps) => {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
      <div className={cn("category-icon", bgColor)}>
        <Icon className={cn("w-6 h-6", iconColor)} />
      </div>
      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </button>
  );
};

export default CategoryIcon;
