import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Share2, ZoomIn, ZoomOut, Sparkles, Save, Check } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CanvasEditor, { CanvasEditorRef } from "@/components/canvas/CanvasEditor";
import { useDesigns } from "@/hooks/useDesigns";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { getTemplateById } from "@/data/templateData";
import type { Json } from "@/integrations/supabase/types";

const Editor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const designId = searchParams.get("id");
  const templateId = searchParams.get("templateId");

  const [zoom, setZoom] = useState(100);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [title, setTitle] = useState("Untitled Design");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialCanvasData, setInitialCanvasData] = useState<object | null>(null);

  const canvasRef = useRef<CanvasEditorRef>(null);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const { createDesign, updateDesign, getDesignById } = useDesigns();
  const { toast } = useToast();

  // Load design if editing existing
  useEffect(() => {
    if (designId && user) {
      getDesignById(designId).then(({ data, error }) => {
        if (data && !error) {
          setTitle(data.title);
          setCanvasWidth(data.width);
          setCanvasHeight(data.height);
          // Canvas data will be loaded in CanvasEditor
        }
      });
    }
  }, [designId, user, getDesignById]);

  // Load template if using a template
  useEffect(() => {
    if (templateId && !designId) {
      const template = getTemplateById(templateId);
      if (template) {
        setTitle(template.title);
        setCanvasWidth(template.width);
        setCanvasHeight(template.height);
        setInitialCanvasData(template.canvasData);
      }
    }
  }, [templateId, designId]);

  const saveDesign = useCallback(async (canvasData?: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your design",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const data = canvasData || canvasRef.current?.getCanvasData?.() || "{}";
      const parsedData = JSON.parse(data) as Json;

      if (designId) {
        // Update existing design
        const { error } = await updateDesign(designId, {
          title,
          canvas_data: parsedData,
          width: canvasWidth,
          height: canvasHeight,
        });

        if (error) throw error;
      } else {
        // Create new design
        const { data: newDesign, error } = await createDesign({
          title,
          canvas_data: parsedData,
          width: canvasWidth,
          height: canvasHeight,
        });

        if (error) throw error;

        if (newDesign) {
          // Update URL with new design ID
          navigate(`/editor?id=${newDesign.id}`, { replace: true });
        }
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving design:", error);
      toast({
        title: "Save failed",
        description: "Failed to save your design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, designId, title, canvasWidth, canvasHeight, updateDesign, createDesign, navigate, toast]);

  // Autosave functionality
  const triggerAutosave = useCallback(() => {
    if (!user) return;

    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    // Set new autosave timeout (3 seconds after last change)
    autosaveTimeoutRef.current = setTimeout(() => {
      saveDesign();
    }, 3000);
  }, [user, saveDesign]);

  // Cleanup autosave timeout on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    triggerAutosave();
  };

  return (
    <div className="h-screen flex flex-col bg-secondary">
      {/* Top Toolbar */}
      <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/projects" className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
          />
          {user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isSaving ? (
                <>
                  <Save className="w-4 h-4 animate-pulse" />
                  <span>Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Saved</span>
                </>
              ) : hasUnsavedChanges ? (
                <span>Unsaved changes</span>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveDesign()}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Assist
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </header>

      {/* Canvas Editor */}
      <CanvasEditor
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        zoom={zoom}
        designId={designId}
        templateData={initialCanvasData}
        onCanvasChange={triggerAutosave}
      />

      {/* Bottom Toolbar - Zoom */}
      <footer className="h-12 bg-card border-t border-border flex items-center justify-center gap-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setZoom(Math.max(25, zoom - 25))}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setZoom(Math.min(200, zoom + 25))}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </footer>
    </div>
  );
};

export default Editor;
