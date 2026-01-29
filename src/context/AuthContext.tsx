import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import type { Json } from "@/integrations/supabase/types";

interface Profile {
    id: string;
    user_id: string;
    display_name: string | null;
    avatar_url: string | null;
    preferences: Json;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signInWithGitHub: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
    updateProfile: (updates: Partial<Omit<Profile, "id" | "user_id">>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set up auth state listener BEFORE getting session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log("Auth state changed:", event, session?.user?.email);
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    // Fetch profile using setTimeout to avoid Supabase deadlock
                    setTimeout(async () => {
                        const { data } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("user_id", session.user.id)
                            .maybeSingle();

                        setProfile(data);
                        setLoading(false);
                    }, 0);
                } else {
                    setProfile(null);
                    setLoading(false);
                }
            }
        );

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", session.user.id)
                    .maybeSingle()
                    .then(({ data }) => {
                        setProfile(data);
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });
        return { error };
    };

    const signInWithGitHub = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: window.location.origin,
            },
        });
        return { error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const updateProfile = async (updates: Partial<Omit<Profile, "id" | "user_id">>) => {
        if (!user) return { error: new Error("Not authenticated") };

        const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("user_id", user.id);

        if (!error) {
            setProfile((prev) => prev ? { ...prev, ...updates } : null);
        }

        return { error };
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            profile,
            loading,
            signInWithGoogle,
            signInWithGitHub,
            signOut,
            updateProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
