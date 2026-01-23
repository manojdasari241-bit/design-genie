import { useState } from "react";
import { ArrowLeft, Download, Share2, Undo, Redo, ZoomIn, ZoomOut, MousePointer2, Type, Square, Circle, Image, Shapes, Layers, Settings, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "text", icon: Type, label: "Text" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "image", icon: Image, label: "Image" },
  { id: "shapes", icon: Shapes, label: "Shapes" },
  { id: "layers", icon: Layers, label: "Layers" },
];

const Editor = () => {
  const [activeTool, setActiveTool] = useState("select");
  const [zoom, setZoom] = useState(100);

  return (
    <div className="h-screen flex flex-col bg-secondary">
      {/* Top Toolbar */}
      <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
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
          <Button size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar - Tools */}
        <aside className="w-16 bg-card border-r border-border flex flex-col items-center py-4 gap-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTool === tool.id 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <tool.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tool.label}</span>
            </button>
          ))}
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div 
            className="bg-card shadow-2xl rounded-lg"
            style={{ 
              width: `${800 * (zoom / 100)}px`, 
              height: `${600 * (zoom / 100)}px`,
              transition: "all 0.2s ease"
            }}
          >
            {/* Canvas placeholder */}
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Shapes className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Start designing</p>
                <p className="text-sm opacity-70">Use the tools on the left to add elements</p>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-72 bg-card border-l border-border p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Properties</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground text-center">
                Select an element to view and edit its properties
              </p>
            </div>
            
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium mb-3">Page Size</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Width</label>
                  <input 
                    type="number" 
                    defaultValue={800} 
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Height</label>
                  <input 
                    type="number" 
                    defaultValue={600} 
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium mb-3">Background</h4>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-white border border-border" />
                <button className="w-8 h-8 rounded-lg bg-primary" />
                <button className="w-8 h-8 rounded-lg bg-accent" />
                <button className="w-8 h-8 rounded-lg bg-category-pink" />
                <button className="w-8 h-8 rounded-lg bg-category-orange" />
              </div>
            </div>
          </div>
        </aside>
      </div>

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
