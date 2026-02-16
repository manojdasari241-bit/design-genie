import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface Design {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  canvas_data: Json;
  thumbnail_url: string | null;
  width: number;
  height: number;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export const useDesigns = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDesigns = useCallback(async () => {
    if (!user) {
      setDesigns([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching designs:", error);
      toast({
        title: "Error",
        description: "Failed to load designs",
        variant: "destructive",
      });
    } else {
      setDesigns((data as Design[]) || []);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  const createDesign = useCallback(
    async (design: Partial<Omit<Design, "id" | "user_id" | "created_at" | "updated_at">>) => {
      if (!user) return { data: null, error: new Error("Not authenticated") };

      const { data, error } = await supabase
        .from("designs")
        .insert({
          user_id: user.id,
          title: design.title || "Untitled Design",
          description: design.description || null,
          canvas_data: (design.canvas_data || {}) as Json,
          thumbnail_url: design.thumbnail_url || null,
          width: design.width || 800,
          height: design.height || 600,
          is_template: design.is_template || false,
        })
        .select()
        .single();

      if (!error && data) {
        setDesigns((prev) => [data as Design, ...prev]);
      }

      return { data: data as Design | null, error };
    },
    [user]
  );

  const updateDesign = useCallback(
    async (id: string, updates: Partial<Omit<Design, "id" | "user_id" | "created_at" | "updated_at">>) => {
      if (!user) return { error: new Error("Not authenticated") };

      const updateData: Record<string, unknown> = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.canvas_data !== undefined) updateData.canvas_data = updates.canvas_data;
      if (updates.thumbnail_url !== undefined) updateData.thumbnail_url = updates.thumbnail_url;
      if (updates.width !== undefined) updateData.width = updates.width;
      if (updates.height !== undefined) updateData.height = updates.height;
      if (updates.is_template !== undefined) updateData.is_template = updates.is_template;

      const { error } = await supabase
        .from("designs")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id);

      if (!error) {
        setDesigns((prev) =>
          prev.map((d) => (d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d))
        );
      }

      return { error };
    },
    [user]
  );

  const deleteDesign = useCallback(
    async (id: string) => {
      if (!user) return { error: new Error("Not authenticated") };

      const { error } = await supabase
        .from("designs")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (!error) {
        setDesigns((prev) => prev.filter((d) => d.id !== id));
        toast({
          title: "Design deleted",
          description: "Your design has been deleted",
        });
      }

      return { error };
    },
    [user, toast]
  );

  const duplicateDesign = useCallback(
    async (id: string) => {
      const design = designs.find((d) => d.id === id);
      if (!design) return { data: null, error: new Error("Design not found") };

      return createDesign({
        title: `${design.title} (Copy)`,
        description: design.description,
        canvas_data: design.canvas_data,
        width: design.width,
        height: design.height,
      });
    },
    [designs, createDesign]
  );

  const getDesignById = useCallback(
    async (id: string) => {
      if (!user) return { data: null, error: new Error("Not authenticated") };

      const { data, error } = await supabase
        .from("designs")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      return { data: data as Design | null, error };
    },
    [user]
  );

  return {
    designs,
    loading,
    fetchDesigns,
    createDesign,
    updateDesign,
    deleteDesign,
    duplicateDesign,
    getDesignById,
  };
};
