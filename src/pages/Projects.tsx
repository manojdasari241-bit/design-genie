import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useDesigns, Design } from "@/hooks/useDesigns";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Grid3X3,
  List,
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  FolderOpen,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { templates } from "@/data/templateData";

const Projects = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { designs, loading, createDesign, deleteDesign, duplicateDesign } = useDesigns();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<Design | null>(null);

  const filteredDesigns = designs.filter((design) =>
    design.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDesign = async () => {
    const { data, error } = await createDesign({ title: "Untitled Design" });
    if (data && !error) {
      navigate(`/editor?id=${data.id}`);
    }
  };

  const handleOpenDesign = (id: string) => {
    navigate(`/editor?id=${id}`);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateDesign(id);
  };

  const handleDeleteClick = (design: Design) => {
    setDesignToDelete(design);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (designToDelete) {
      await deleteDesign(designToDelete.id);
      setDeleteDialogOpen(false);
      setDesignToDelete(null);
    }
  };

  // Show empty state with templates when there are no designs or user is not logged in
  const showEmptyState = !loading && (filteredDesigns.length === 0 || !user);

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8 ml-20">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-muted rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center ml-20">
          <div className="text-center">
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Sign in to view your projects</h2>
            <p className="text-muted-foreground mb-4">
              Create an account or sign in to start designing
            </p>
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 ml-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <Button onClick={handleCreateDesign} className="gap-2">
            <Plus className="w-4 h-4" />
            New Design
          </Button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className={viewMode === "grid" ? "h-48 rounded-xl" : "h-20 rounded-lg"} />
            ))}
          </div>
        ) : filteredDesigns.length === 0 ? (
          /* Empty State with Starter Templates */
          <div className="py-8">
            {/* No Projects Message */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {searchQuery ? "No designs found" : "Welcome to Design Genie!"}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first design from scratch or start with a template"}
              </p>
              {!searchQuery && (
                <div className="flex items-center justify-center gap-4">
                  <Button onClick={handleCreateDesign} size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Create Blank Design
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2" onClick={() => navigate("/templates")}>
                    <Sparkles className="w-5 h-5" />
                    Browse Templates
                  </Button>
                </div>
              )}
            </div>

            {/* Starter Templates Section */}
            {!searchQuery && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Start with a Template</h3>
                    <p className="text-sm text-muted-foreground">Quick-start your project with these popular designs</p>
                  </div>
                  <Link to="/templates" className="text-sm text-primary hover:underline flex items-center gap-1">
                    View all templates <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {templates.slice(0, 10).map((template) => (
                    <Link
                      key={template.id}
                      to={`/editor?templateId=${template.id}`}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-2 relative border border-border hover:border-primary/50 transition-colors">
                        <img
                          src={template.thumbnail}
                          alt={template.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 bg-card px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg transition-opacity">
                            Use Template
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-medium truncate">{template.title}</h4>
                      <p className="text-xs text-muted-foreground">{template.category}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="group relative bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleOpenDesign(design.id)}
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {design.thumbnail_url ? (
                    <img
                      src={design.thumbnail_url}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl font-bold text-muted-foreground/20">
                      {design.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{design.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(design.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenDesign(design.id); }}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(design.id); }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(design); }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="group flex items-center gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenDesign(design.id)}
              >
                <div className="w-16 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  {design.thumbnail_url ? (
                    <img
                      src={design.thumbnail_url}
                      alt={design.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="text-lg font-bold text-muted-foreground/20">
                      {design.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{design.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {design.width} × {design.height} • Updated {formatDistanceToNow(new Date(design.updated_at), { addSuffix: true })}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenDesign(design.id); }}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(design.id); }}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => { e.stopPropagation(); handleDeleteClick(design); }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Design</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{designToDelete?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Projects;
