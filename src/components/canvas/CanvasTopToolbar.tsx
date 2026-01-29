import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Trash2,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FabricObject, IText } from "fabric";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface CanvasTopToolbarProps {
    selectedObject: FabricObject | null;
    onUpdate: (property: string, value: unknown) => void;
    onDelete: () => void;
}

const colorOptions = [
    "#ffffff", "#000000", "#1F2937", "#EF4444", "#F97316",
    "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6", "#EC4899",
    "#06B6D4", "#6366F1", "#A855F7", "#D946EF", "#F43F5E"
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

const fontSizes = [6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 96];

const CanvasTopToolbar = ({ selectedObject, onUpdate, onDelete }: CanvasTopToolbarProps) => {
    if (!selectedObject) {
        return (
            <div className="h-12 bg-white dark:bg-card border-b border-border flex items-center px-4 text-sm text-muted-foreground">
                Click on an element to edit
            </div>
        );
    }

    const isText = selectedObject.type === "i-text";

    const getFillColor = () => {
        const fill = selectedObject.get("fill");
        return typeof fill === "string" ? fill : "#000000";
    };

    const getTextProperty = (prop: string, defaultValue: unknown) => {
        if (!isText) return defaultValue;
        return (selectedObject as IText).get(prop as keyof IText) ?? defaultValue;
    };

    return (
        <div className="h-12 bg-white dark:bg-card border-b border-border flex items-center px-4 gap-2 overflow-x-auto">

            {/* Color Picker (For both Text and Shapes) */}
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className="w-8 h-8 rounded border border-border shadow-sm flex items-center justify-center hover:ring-2 hover:ring-primary/50 transition-all"
                        style={{ backgroundColor: getFillColor() }}
                        title="Color"
                    />
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3">
                    <div className="grid grid-cols-5 gap-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color}
                                onClick={() => onUpdate("fill", color)}
                                className={`w-8 h-8 rounded-full border border-border transition-transform hover:scale-110 ${getFillColor() === color ? "ring-2 ring-primary ring-offset-2" : ""
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="text-xs font-medium mb-2 text-muted-foreground">Custom Color</div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded border border-border flex-shrink-0" style={{ backgroundColor: getFillColor() }}></div>
                            <input
                                type="text"
                                value={getFillColor()}
                                onChange={(e) => onUpdate("fill", e.target.value)}
                                className="flex-1 h-8 text-xs border border-border rounded px-2"
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {isText && (
                <>
                    {/* Font Family */}
                    <Select
                        value={getTextProperty("fontFamily", "Inter, sans-serif") as string}
                        onValueChange={(value) => onUpdate("fontFamily", value)}
                    >
                        <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {fontFamilies.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Font Size */}
                    <Select
                        value={String(getTextProperty("fontSize", 24))}
                        onValueChange={(value) => onUpdate("fontSize", parseInt(value))}
                    >
                        <SelectTrigger className="w-20 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {fontSizes.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    {/* Text Styling */}
                    <div className="flex items-center bg-secondary/50 rounded-lg p-0.5">
                        <Button
                            variant={getTextProperty("fontWeight", "normal") === "bold" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdate("fontWeight", getTextProperty("fontWeight", "normal") === "bold" ? "normal" : "bold")}
                        >
                            <Bold className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant={getTextProperty("fontStyle", "normal") === "italic" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdate("fontStyle", getTextProperty("fontStyle", "normal") === "italic" ? "normal" : "italic")}
                        >
                            <Italic className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant={getTextProperty("underline", false) ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdate("underline", !getTextProperty("underline", false))}
                        >
                            <Underline className="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    {/* Alignment */}
                    <div className="flex items-center bg-secondary/50 rounded-lg p-0.5">
                        <Button
                            variant={getTextProperty("textAlign", "left") === "left" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdate("textAlign", "left")}
                        >
                            <AlignLeft className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant={getTextProperty("textAlign", "left") === "center" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdate("textAlign", "center")}
                        >
                            <AlignCenter className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant={getTextProperty("textAlign", "left") === "right" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdate("textAlign", "right")}
                        >
                            <AlignRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </>
            )}

            {!isText && (
                <div className="flex items-center gap-2">
                    {/* Opacity Slider for non-text (can assume always available) */}
                    <span className="text-xs text-muted-foreground ml-2">Opacity</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={selectedObject.get("opacity") || 1}
                        onChange={(e) => onUpdate("opacity", parseFloat(e.target.value))}
                        className="w-24 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            )}

            <div className="flex-1" />

            {/* Delete Button */}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
            </Button>

        </div>
    );
};

export default CanvasTopToolbar;
