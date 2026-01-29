import { useState } from "react";
import { Sparkles, Wand2, Palette, Type, Layout, Loader2, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type GenerationType = "image" | "ideas" | "colors" | "layout";

const generationOptions = [
  { id: "image" as GenerationType, icon: Wand2, label: "Generate Image", description: "Create a design from your description" },
  { id: "ideas" as GenerationType, icon: Sparkles, label: "Design Ideas", description: "Get creative suggestions for your project" },
  { id: "colors" as GenerationType, icon: Palette, label: "Color Palette", description: "Generate color schemes that work" },
  { id: "layout" as GenerationType, icon: Layout, label: "Layout Tips", description: "Get layout and composition advice" },
];

const DesignAI = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedType, setSelectedType] = useState<GenerationType>("image");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ imageUrl?: string; text?: string } | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let aiPrompt = prompt;
      let type = "text";

      if (selectedType === "image") {
        type = "image";
        aiPrompt = `Create a professional design: ${prompt}. Make it modern, clean, and visually appealing with good use of color and typography.`;
      } else if (selectedType === "ideas") {
        aiPrompt = `I need creative design ideas for: ${prompt}. Please provide 5 specific, actionable design concepts with brief descriptions of visual elements, style, and mood.`;
      } else if (selectedType === "colors") {
        aiPrompt = `Suggest a professional color palette for: ${prompt}. Include primary, secondary, and accent colors with hex codes. Explain why these colors work together and the mood they create.`;
      } else if (selectedType === "layout") {
        aiPrompt = `Provide layout and composition tips for: ${prompt}. Include specific recommendations for hierarchy, spacing, alignment, and visual flow.`;
      }

      const { data, error } = await supabase.functions.invoke("generate-design", {
        body: { prompt: aiPrompt, type },
      });

      if (error) throw error;

      if (type === "image" && data.imageUrl) {
        setResult({ imageUrl: data.imageUrl, text: data.description });
      } else if (data.suggestion) {
        setResult({ text: data.suggestion });
      }

      toast.success("Generated successfully!");
    } catch (error: any) {
      console.error("Generation error:", error);
      if (error.message?.includes("429") || error.message?.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please wait a moment and try again.");
      } else if (error.message?.includes("402")) {
        toast.error("AI credits exhausted. Please add credits to continue.");
      } else {
        toast.error(error.message || "Failed to generate. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setResult(null);
  };

  return (
    <div className="px-8 py-8 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Design Assistant
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Create with DesignAI</h2>
          <p className="text-muted-foreground">Describe what you want to create and let AI help you design it</p>
        </div>

        {/* Generation Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {generationOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedType(option.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                selectedType === option.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
            >
              <option.icon className={`w-6 h-6 mb-2 transition-colors ${
                selectedType === option.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              }`} />
              <h3 className="font-semibold text-sm text-foreground">{option.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              selectedType === "image"
                ? "Describe the design you want to create... e.g., 'A modern tech startup logo with abstract geometric shapes in blue and purple'"
                : selectedType === "ideas"
                ? "What kind of project are you working on? e.g., 'A wedding invitation for a garden party theme'"
                : selectedType === "colors"
                ? "Describe the mood or purpose... e.g., 'A calming spa website with natural, earthy tones'"
                : "What are you designing? e.g., 'A mobile app dashboard for fitness tracking'"
            }
            className="min-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base"
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {prompt.length}/500 characters
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClear} disabled={isLoading}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Clear
              </Button>
              <Button size="sm" onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-card border border-border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Generated Result
            </h3>
            
            {result.imageUrl && (
              <div className="mb-4">
                <div className="relative group">
                  <img
                    src={result.imageUrl}
                    alt="Generated design"
                    className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <a
                      href={result.imageUrl}
                      download="design.png"
                      className="px-4 py-2 bg-white text-foreground rounded-lg font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {result.text && (
              <div className="prose prose-sm max-w-none text-foreground">
                <div className="whitespace-pre-wrap bg-secondary/30 rounded-lg p-4 text-sm">
                  {result.text}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Suggestions */}
        {!result && !isLoading && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Try these prompts:</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Modern minimalist logo for a coffee shop",
                "Instagram post for summer sale announcement",
                "Professional resume template with clean layout",
                "Business card design for a photographer",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-full text-sm text-foreground transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignAI;
