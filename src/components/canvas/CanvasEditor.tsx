import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Canvas, Rect, Circle, IText, Image as FabricImage, FabricObject, Line, Polygon, Gradient } from "fabric";
import CanvasToolbar from "./CanvasToolbar";
import CanvasProperties from "./CanvasProperties";
import LayersPanel from "./LayersPanel";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CanvasEditorProps {
  width?: number;
  height?: number;
  zoom?: number;
  designId?: string | null;
  templateData?: object | null;
  onCanvasChange?: () => void;
}

export interface CanvasEditorRef {
  getCanvasData: () => string | null;
}

const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(
  ({ width = 800, height = 600, zoom = 100, designId, templateData, onCanvasChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
    const [activeTool, setActiveTool] = useState("select");
    const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [layersKey, setLayersKey] = useState(0); // Force layers panel refresh

    const { user } = useAuth();

    // Expose getCanvasData to parent
    useImperativeHandle(ref, () => ({
      getCanvasData: () => {
        if (!fabricRef.current) return null;
        return JSON.stringify(fabricRef.current.toJSON());
      },
    }));

    // Initialize Fabric canvas
    useEffect(() => {
      if (!canvasRef.current) return;

      const canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#ffffff",
        selection: true,
      });

      fabricRef.current = canvas;

      // Event listeners
      canvas.on("selection:created", (e) => {
        setSelectedObject(e.selected?.[0] || null);
      });

      canvas.on("selection:updated", (e) => {
        setSelectedObject(e.selected?.[0] || null);
      });

      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
      });

      canvas.on("object:modified", () => {
        saveToHistory();
        onCanvasChange?.();
      });

      canvas.on("object:added", () => {
        if (isLoaded) {
          onCanvasChange?.();
        }
      });

      return () => {
        canvas.dispose();
      };
    }, []);

    // Load design data if editing existing
    useEffect(() => {
      if (designId && user && fabricRef.current && !isLoaded) {
        supabase
          .from("designs")
          .select("canvas_data")
          .eq("id", designId)
          .eq("user_id", user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.canvas_data && fabricRef.current && typeof data.canvas_data === 'object') {
              fabricRef.current.loadFromJSON(data.canvas_data as Record<string, unknown>).then(() => {
                fabricRef.current?.renderAll();
                setIsLoaded(true);
                setLayersKey(prev => prev + 1);
                saveToHistory();
              });
            } else {
              setIsLoaded(true);
              saveToHistory();
            }
          });
      } else if (!designId && !templateData) {
        setIsLoaded(true);
        saveToHistory();
      }
    }, [designId, user, isLoaded, templateData]);

    // Load template data if provided
    useEffect(() => {
      if (templateData && fabricRef.current && !isLoaded && !designId) {
        fabricRef.current.loadFromJSON(templateData as Record<string, unknown>).then(() => {
          fabricRef.current?.renderAll();
          setIsLoaded(true);
          setLayersKey(prev => prev + 1);
          saveToHistory();
        });
      }
    }, [templateData, isLoaded, designId]);

    // Update canvas size when dimensions change
    useEffect(() => {
      if (fabricRef.current) {
        fabricRef.current.setDimensions({ width, height });
        fabricRef.current.renderAll();
      }
    }, [width, height]);

    const saveToHistory = useCallback(() => {
      if (!fabricRef.current) return;

      const json = JSON.stringify(fabricRef.current.toJSON());
      setCanvasHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, json];
      });
      setHistoryIndex((prev) => prev + 1);
    }, [historyIndex]);

    const undo = useCallback(() => {
      if (historyIndex <= 0 || !fabricRef.current) return;

      const newIndex = historyIndex - 1;
      fabricRef.current.loadFromJSON(canvasHistory[newIndex]).then(() => {
        fabricRef.current?.renderAll();
        setHistoryIndex(newIndex);
        onCanvasChange?.();
      });
    }, [historyIndex, canvasHistory, onCanvasChange]);

    const redo = useCallback(() => {
      if (historyIndex >= canvasHistory.length - 1 || !fabricRef.current) return;

      const newIndex = historyIndex + 1;
      fabricRef.current.loadFromJSON(canvasHistory[newIndex]).then(() => {
        fabricRef.current?.renderAll();
        setHistoryIndex(newIndex);
        onCanvasChange?.();
      });
    }, [historyIndex, canvasHistory, onCanvasChange]);

    const addRectangle = useCallback(() => {
      if (!fabricRef.current) return;

      const rect = new Rect({
        left: 100,
        top: 100,
        width: 150,
        height: 100,
        fill: "#8B5CF6",
        stroke: "#7C3AED",
        strokeWidth: 2,
        cornerStyle: "circle",
        cornerColor: "#8B5CF6",
      });

      fabricRef.current.add(rect);
      fabricRef.current.setActiveObject(rect);
      fabricRef.current.renderAll();
      saveToHistory();
    }, [saveToHistory]);

    const addCircle = useCallback(() => {
      if (!fabricRef.current) return;

      const circle = new Circle({
        left: 150,
        top: 150,
        radius: 60,
        fill: "#EC4899",
        stroke: "#DB2777",
        strokeWidth: 2,
        cornerStyle: "circle",
        cornerColor: "#EC4899",
      });

      fabricRef.current.add(circle);
      fabricRef.current.setActiveObject(circle);
      fabricRef.current.renderAll();
      saveToHistory();
    }, [saveToHistory]);

    const addText = useCallback(() => {
      if (!fabricRef.current) return;

      const text = new IText("Double click to edit", {
        left: 100,
        top: 200,
        fontSize: 24,
        fontFamily: "Inter, sans-serif",
        fill: "#1F2937",
      });

      fabricRef.current.add(text);
      fabricRef.current.setActiveObject(text);
      fabricRef.current.renderAll();
      saveToHistory();
    }, [saveToHistory]);

    const addLine = useCallback(() => {
      if (!fabricRef.current) return;

      const line = new Line([50, 100, 200, 100], {
        stroke: "#3B82F6",
        strokeWidth: 3,
        cornerStyle: "circle",
        cornerColor: "#3B82F6",
      });

      fabricRef.current.add(line);
      fabricRef.current.setActiveObject(line);
      fabricRef.current.renderAll();
      saveToHistory();
    }, [saveToHistory]);

    const addArrow = useCallback(() => {
      if (!fabricRef.current) return;

      // Create arrow as a polygon with arrow shape
      const arrowPoints = [
        { x: 0, y: 10 },
        { x: 100, y: 10 },
        { x: 100, y: 0 },
        { x: 130, y: 15 },
        { x: 100, y: 30 },
        { x: 100, y: 20 },
        { x: 0, y: 20 },
      ];

      const arrow = new Polygon(arrowPoints, {
        left: 100,
        top: 150,
        fill: "#10B981",
        stroke: "#059669",
        strokeWidth: 1,
        cornerStyle: "circle",
        cornerColor: "#10B981",
      });

      fabricRef.current.add(arrow);
      fabricRef.current.setActiveObject(arrow);
      fabricRef.current.renderAll();
      saveToHistory();
    }, [saveToHistory]);

    const addPolygon = useCallback(() => {
      if (!fabricRef.current) return;

      // Create hexagon (6-sided polygon)
      const sides = 6;
      const radius = 60;
      const points = [];
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        points.push({
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
        });
      }

      const polygon = new Polygon(points, {
        left: 150,
        top: 150,
        fill: "#F59E0B",
        stroke: "#D97706",
        strokeWidth: 2,
        cornerStyle: "circle",
        cornerColor: "#F59E0B",
      });

      fabricRef.current.add(polygon);
      fabricRef.current.setActiveObject(polygon);
      fabricRef.current.renderAll();
      saveToHistory();
    }, [saveToHistory]);

    const addGradientRect = useCallback(() => {
      if (!fabricRef.current) return;

      const rect = new Rect({
        left: 100,
        top: 100,
        width: 150,
        height: 100,
        cornerStyle: "circle",
        cornerColor: "#8B5CF6",
      });

      // Apply gradient fill
      const gradient = new Gradient({
        type: "linear",
        coords: { x1: 0, y1: 0, x2: rect.width, y2: 0 },
        colorStops: [
          { offset: 0, color: "#8B5CF6" },
          { offset: 1, color: "#EC4899" },
        ],
      });

      rect.set("fill", gradient);

      fabricRef.current.add(rect);
      fabricRef.current.setActiveObject(rect);
      fabricRef.current.renderAll();
      saveToHistory();
    }, [saveToHistory]);

    const addImage = useCallback(
      async (url: string) => {
        if (!fabricRef.current) return;

        try {
          const img = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
          img.scaleToWidth(200);
          img.set({ left: 100, top: 100 });
          fabricRef.current.add(img);
          fabricRef.current.setActiveObject(img);
          fabricRef.current.renderAll();
          saveToHistory();
        } catch (error) {
          console.error("Failed to add image:", error);
        }
      },
      [saveToHistory]
    );

    const handleImageUpload = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          addImage(dataUrl);
        };
        reader.readAsDataURL(file);
      },
      [addImage]
    );

    const deleteSelected = useCallback(() => {
      if (!fabricRef.current) return;

      const activeObjects = fabricRef.current.getActiveObjects();
      activeObjects.forEach((obj) => {
        fabricRef.current?.remove(obj);
      });
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
      saveToHistory();
      onCanvasChange?.();
    }, [saveToHistory, onCanvasChange]);

    const updateSelectedObject = useCallback(
      (property: string, value: unknown) => {
        if (!selectedObject || !fabricRef.current) return;

        selectedObject.set(property as keyof FabricObject, value);
        fabricRef.current.renderAll();
        setSelectedObject({ ...selectedObject } as FabricObject);
        saveToHistory();
        onCanvasChange?.();
      },
      [selectedObject, saveToHistory, onCanvasChange]
    );

    const handleToolClick = useCallback(
      (tool: string) => {
        setActiveTool(tool);

        switch (tool) {
          case "rectangle":
            addRectangle();
            break;
          case "circle":
            addCircle();
            break;
          case "text":
            addText();
            break;
          case "line":
            addLine();
            break;
          case "arrow":
            addArrow();
            break;
          case "polygon":
            addPolygon();
            break;
          case "gradient":
            addGradientRect();
            break;
          default:
            break;
        }
      },
      [addRectangle, addCircle, addText, addLine, addArrow, addPolygon, addGradientRect]
    );

    const downloadCanvas = useCallback((format: "png" | "jpg" | "pdf" = "png") => {
      if (!fabricRef.current) return;

      const dataUrl = fabricRef.current.toDataURL({
        multiplier: 1,
        format: format === "jpg" ? "jpeg" : "png",
        quality: 1,
      });

      const link = document.createElement("a");
      link.download = `design.${format}`;
      link.href = dataUrl;
      link.click();
    }, []);

    return (
      <div className="flex flex-1 h-full">
        <CanvasToolbar
          activeTool={activeTool}
          onToolClick={handleToolClick}
          onUndo={undo}
          onRedo={redo}
          onDelete={deleteSelected}
          onImageUpload={handleImageUpload}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < canvasHistory.length - 1}
        />

        <div className="flex-1 flex items-center justify-center bg-secondary overflow-auto p-8">
          <div
            className="shadow-2xl rounded-lg overflow-hidden"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center",
            }}
          >
            <canvas ref={canvasRef} />
          </div>
        </div>

        <CanvasProperties
          selectedObject={selectedObject}
          onUpdate={updateSelectedObject}
          onDownload={downloadCanvas}
          canvasWidth={width}
          canvasHeight={height}
        />

        <LayersPanel
          key={layersKey}
          canvas={fabricRef.current}
          selectedObject={selectedObject}
          onSelectObject={setSelectedObject}
          onLayersChange={() => {
            setLayersKey(prev => prev + 1);
            onCanvasChange?.();
          }}
        />
      </div>
    );
  }
);

CanvasEditor.displayName = "CanvasEditor";

export default CanvasEditor;
