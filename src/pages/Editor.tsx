import { useState } from "react";
import { ArrowLeft, Share2, ZoomIn, ZoomOut, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CanvasEditor from "@/components/canvas/CanvasEditor";

const Editor = () => {
  const [zoom, setZoom] = useState(100);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);

  return (
    <div className="h-screen flex flex-col bg-secondary">
      {/* Top Toolbar */}
      <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <input 
            type="text" 
            defaultValue="Untitled Design" 
            className="bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
          />
        </div>
        
        <div className="flex items-center gap-2">
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
        width={canvasWidth} 
        height={canvasHeight} 
        zoom={zoom} 
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
