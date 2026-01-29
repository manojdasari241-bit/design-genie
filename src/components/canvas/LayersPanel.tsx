import { useCallback, useState } from "react";
import { Eye, EyeOff, Lock, Unlock, Layers, GripVertical } from "lucide-react";
import { FabricObject, Canvas } from "fabric";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LayerItem {
    id: string;
    object: FabricObject;
    name: string;
    type: string;
    visible: boolean;
    locked: boolean;
}

interface LayersPanelProps {
    canvas: Canvas | null;
    selectedObject: FabricObject | null;
    onSelectObject: (obj: FabricObject | null) => void;
    onLayersChange: () => void;
}

const getObjectName = (obj: FabricObject, index: number): string => {
    const type = obj.type || "object";
    switch (type) {
        case "rect":
            return `Rectangle ${index + 1}`;
        case "circle":
            return `Circle ${index + 1}`;
        case "i-text":
            const text = (obj as { text?: string }).text;
            return text ? text.substring(0, 15) + (text.length > 15 ? "..." : "") : `Text ${index + 1}`;
        case "line":
            return `Line ${index + 1}`;
        case "polygon":
            return `Polygon ${index + 1}`;
        case "image":
            return `Image ${index + 1}`;
        default:
            return `Object ${index + 1}`;
    }
};

const LayersPanel = ({
    canvas,
    selectedObject,
    onSelectObject,
    onLayersChange,
}: LayersPanelProps) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const getLayers = useCallback((): LayerItem[] => {
        if (!canvas) return [];

        const objects = canvas.getObjects();
        return objects.map((obj, index) => ({
            id: `layer-${index}`,
            object: obj,
            name: getObjectName(obj, index),
            type: obj.type || "object",
            visible: obj.visible !== false,
            locked: obj.selectable === false,
        })).reverse(); // Reverse to show top layers first
    }, [canvas]);

    const layers = getLayers();

    const handleVisibilityToggle = useCallback((layer: LayerItem) => {
        const newVisible = !layer.visible;
        layer.object.set("visible", newVisible);
        canvas?.renderAll();
        onLayersChange();
    }, [canvas, onLayersChange]);

    const handleLockToggle = useCallback((layer: LayerItem) => {
        const newLocked = !layer.locked;
        layer.object.set("selectable", !newLocked);
        layer.object.set("evented", !newLocked);
        if (newLocked && selectedObject === layer.object) {
            canvas?.discardActiveObject();
            onSelectObject(null);
        }
        canvas?.renderAll();
        onLayersChange();
    }, [canvas, selectedObject, onSelectObject, onLayersChange]);

    const handleLayerClick = useCallback((layer: LayerItem) => {
        if (layer.locked) return;
        canvas?.setActiveObject(layer.object);
        canvas?.renderAll();
        onSelectObject(layer.object);
    }, [canvas, onSelectObject]);

    const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverIndex(index);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || !canvas) return;

        const objects = canvas.getObjects();
        // Convert from reversed display order to actual canvas order
        const actualDragIndex = objects.length - 1 - draggedIndex;
        const actualDropIndex = objects.length - 1 - dropIndex;

        if (actualDragIndex === actualDropIndex) return;

        const obj = objects[actualDragIndex];

        // Remove and re-insert at new position
        canvas.remove(obj);
        const updatedObjects = canvas.getObjects();

        // Insert at the correct position
        if (actualDropIndex >= updatedObjects.length) {
            canvas.add(obj);
        } else {
            canvas.insertAt(actualDropIndex, obj);
        }

        canvas.renderAll();
        onLayersChange();
        handleDragEnd();
    }, [canvas, draggedIndex, onLayersChange, handleDragEnd]);

    return (
        <div className="w-56 bg-card border-l border-border flex flex-col">
            <div className="p-3 border-b border-border flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Layers</h3>
                <span className="ml-auto text-xs text-muted-foreground">{layers.length}</span>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2">
                    {layers.length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                            No layers yet
                        </div>
                    ) : (
                        layers.map((layer, index) => (
                            <div
                                key={layer.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                onDrop={(e) => handleDrop(e, index)}
                                onClick={() => handleLayerClick(layer)}
                                className={cn(
                                    "flex items-center gap-2 p-2 rounded-lg mb-1 cursor-pointer transition-all",
                                    "hover:bg-secondary/80",
                                    selectedObject === layer.object && "bg-primary/10 border border-primary/30",
                                    draggedIndex === index && "opacity-50",
                                    dragOverIndex === index && "border-t-2 border-primary",
                                    layer.locked && "opacity-60"
                                )}
                            >
                                <GripVertical className="w-3 h-3 text-muted-foreground cursor-grab" />

                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-xs font-medium truncate",
                                        layer.locked && "text-muted-foreground"
                                    )}>
                                        {layer.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground capitalize">
                                        {layer.type.replace("i-text", "text")}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleVisibilityToggle(layer);
                                        }}
                                        className="p-1 rounded hover:bg-secondary"
                                        title={layer.visible ? "Hide" : "Show"}
                                    >
                                        {layer.visible ? (
                                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                        ) : (
                                            <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLockToggle(layer);
                                        }}
                                        className="p-1 rounded hover:bg-secondary"
                                        title={layer.locked ? "Unlock" : "Lock"}
                                    >
                                        {layer.locked ? (
                                            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                                        ) : (
                                            <Unlock className="w-3.5 h-3.5 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default LayersPanel;
