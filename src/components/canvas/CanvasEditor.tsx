import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Canvas, Rect, Circle, IText, Image as FabricImage, FabricObject } from "fabric";
import CanvasToolbar from "./CanvasToolbar";
import CanvasProperties from "./CanvasProperties";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CanvasEditorProps {
  width?: number;
  height?: number;
  zoom?: number;
  designId?: string | null;
  onCanvasChange?: () => void;
}

export interface CanvasEditorRef {
  getCanvasData: () => string | null;
}

const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(
  ({ width = 800, height = 600, zoom = 100, designId, onCanvasChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
    const [activeTool, setActiveTool] = useState("select");
    const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isLoaded, setIsLoaded] = useState(false);

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
                saveToHistory();
              });
            } else {
              setIsLoaded(true);
              saveToHistory();
            }
          });
      } else if (!designId) {
        setIsLoaded(true);
        saveToHistory();
      }
    }, [designId, user, isLoaded]);

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
          default:
            break;
        }
      },
      [addRectangle, addCircle, addText]
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
      </div>
    );
  }
);

CanvasEditor.displayName = "CanvasEditor";

export default CanvasEditor;
