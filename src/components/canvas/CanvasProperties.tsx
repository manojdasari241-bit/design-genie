import { Settings, Download, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FabricObject, IText } from "fabric";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CanvasPropertiesProps {
  selectedObject: FabricObject | null;
  onUpdate: (property: string, value: unknown) => void;
  onDownload: (format: "png" | "jpg" | "pdf") => void;
  canvasWidth: number;
  canvasHeight: number;
}

const colorOptions = [
  "#ffffff", "#8B5CF6", "#EC4899", "#EF4444", "#F97316",
  "#EAB308", "#22C55E", "#06B6D4", "#3B82F6", "#1F2937"
];

const fontFamilies = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Trebuchet MS, sans-serif", label: "Trebuchet MS" },
  { value: "Impact, sans-serif", label: "Impact" },
  { value: "Comic Sans MS, cursive", label: "Comic Sans" },
];

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96];

const CanvasProperties = ({
  selectedObject,
  onUpdate,
  onDownload,
  canvasWidth,
  canvasHeight,
}: CanvasPropertiesProps) => {
  const getFillColor = () => {
    if (!selectedObject) return "#ffffff";
    const fill = selectedObject.get("fill");
    return typeof fill === "string" ? fill : "#ffffff";
  };

  const getStrokeColor = () => {
    if (!selectedObject) return "#000000";
    const stroke = selectedObject.get("stroke");
    return typeof stroke === "string" ? stroke : "#000000";
  };

  const isTextObject = selectedObject && selectedObject.type === "i-text";

  const getTextProperty = (prop: string, defaultValue: unknown) => {
    if (!selectedObject || !isTextObject) return defaultValue;
    return (selectedObject as IText).get(prop as keyof IText) ?? defaultValue;
  };

  return (
    <aside className="w-72 bg-card border-l border-border p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Properties</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Download Section */}
      <div className="mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onDownload("png")}>
              PNG (High Quality)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload("jpg")}>
              JPG (Compressed)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Canvas Size */}
      <div className="border-t border-border pt-4 mb-4">
        <h4 className="text-sm font-medium mb-3">Canvas Size</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Width</label>
            <div className="mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm">
              {canvasWidth}px
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Height</label>
            <div className="mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm">
              {canvasHeight}px
            </div>
          </div>
        </div>
      </div>

      {selectedObject ? (
        <>
          {/* Text Formatting - Only show for text objects */}
          {isTextObject && (
            <div className="border-t border-border pt-4 mb-4">
              <h4 className="text-sm font-medium mb-3">Text Formatting</h4>

              {/* Font Family */}
              <div className="mb-3">
                <label className="text-xs text-muted-foreground">Font Family</label>
                <Select
                  value={getTextProperty("fontFamily", "Inter, sans-serif") as string}
                  onValueChange={(value) => onUpdate("fontFamily", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="mb-3">
                <label className="text-xs text-muted-foreground">Font Size</label>
                <Select
                  value={String(getTextProperty("fontSize", 24))}
                  onValueChange={(value) => onUpdate("fontSize", parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}px
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bold, Italic, Underline */}
              <div className="mb-3">
                <label className="text-xs text-muted-foreground">Style</label>
                <div className="flex gap-1 mt-1">
                  <Button
                    variant={getTextProperty("fontWeight", "normal") === "bold" ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onUpdate("fontWeight", getTextProperty("fontWeight", "normal") === "bold" ? "normal" : "bold")}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={getTextProperty("fontStyle", "normal") === "italic" ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onUpdate("fontStyle", getTextProperty("fontStyle", "normal") === "italic" ? "normal" : "italic")}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={getTextProperty("underline", false) ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onUpdate("underline", !getTextProperty("underline", false))}
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Text Alignment */}
              <div className="mb-3">
                <label className="text-xs text-muted-foreground">Alignment</label>
                <div className="flex gap-1 mt-1">
                  <Button
                    variant={getTextProperty("textAlign", "left") === "left" ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onUpdate("textAlign", "left")}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={getTextProperty("textAlign", "left") === "center" ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onUpdate("textAlign", "center")}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={getTextProperty("textAlign", "left") === "right" ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onUpdate("textAlign", "right")}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={getTextProperty("textAlign", "left") === "justify" ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onUpdate("textAlign", "justify")}
                  >
                    <AlignJustify className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Fill Color */}
          <div className="border-t border-border pt-4 mb-4">
            <h4 className="text-sm font-medium mb-3">Fill Color</h4>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdate("fill", color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${getFillColor() === color
                      ? "border-primary scale-110"
                      : "border-border hover:border-primary/50"
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="mt-2">
              <input
                type="color"
                value={getFillColor()}
                onChange={(e) => onUpdate("fill", e.target.value)}
                className="w-full h-10 rounded-lg border border-border cursor-pointer"
              />
            </div>
          </div>

          {/* Stroke Color */}
          <div className="border-t border-border pt-4 mb-4">
            <h4 className="text-sm font-medium mb-3">Stroke Color</h4>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdate("stroke", color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${getStrokeColor() === color
                      ? "border-primary scale-110"
                      : "border-border hover:border-primary/50"
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div className="border-t border-border pt-4 mb-4">
            <h4 className="text-sm font-medium mb-3">Opacity</h4>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedObject.get("opacity") || 1}
              onChange={(e) => onUpdate("opacity", parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((selectedObject.get("opacity") || 1) * 100)}%
            </div>
          </div>

          {/* Position */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium mb-3">Position</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">X</label>
                <input
                  type="number"
                  value={Math.round(selectedObject.get("left") || 0)}
                  onChange={(e) => onUpdate("left", parseInt(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Y</label>
                <input
                  type="number"
                  value={Math.round(selectedObject.get("top") || 0)}
                  onChange={(e) => onUpdate("top", parseInt(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 rounded-lg bg-secondary">
          <p className="text-sm text-muted-foreground text-center">
            Select an element to view and edit its properties
          </p>
        </div>
      )}
    </aside>
  );
};

export default CanvasProperties;

