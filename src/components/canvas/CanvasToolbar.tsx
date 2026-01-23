import { MousePointer2, Type, Square, Circle, Image, Trash2, Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface CanvasToolbarProps {
  activeTool: string;
  onToolClick: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  canUndo: boolean;
  canRedo: boolean;
}

const tools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "text", icon: Type, label: "Text" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "image", icon: Image, label: "Image" },
];

const CanvasToolbar = ({
  activeTool,
  onToolClick,
  onUndo,
  onRedo,
  onDelete,
  onImageUpload,
  canUndo,
  canRedo,
}: CanvasToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToolClick = (toolId: string) => {
    if (toolId === "image") {
      fileInputRef.current?.click();
    } else {
      onToolClick(toolId);
    }
  };

  return (
    <aside className="w-16 bg-card border-r border-border flex flex-col items-center py-4 gap-1">
      {/* Undo/Redo */}
      <div className="flex flex-col gap-1 mb-4 pb-4 border-b border-border">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            "w-12 h-10 rounded-lg flex items-center justify-center transition-colors",
            canUndo
              ? "hover:bg-secondary text-muted-foreground hover:text-foreground"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            "w-12 h-10 rounded-lg flex items-center justify-center transition-colors",
            canRedo
              ? "hover:bg-secondary text-muted-foreground hover:text-foreground"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>

      {/* Tools */}
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => handleToolClick(tool.id)}
          className={cn(
            "w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors",
            activeTool === tool.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
          )}
          title={tool.label}
        >
          <tool.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{tool.label}</span>
        </button>
      ))}

      {/* Delete */}
      <button
        onClick={onDelete}
        className="w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors hover:bg-destructive/10 text-muted-foreground hover:text-destructive mt-auto"
        title="Delete"
      >
        <Trash2 className="w-5 h-5" />
        <span className="text-[10px] font-medium">Delete</span>
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
    </aside>
  );
};

export default CanvasToolbar;
