import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Palette,
    Globe,
    Shield,
    HelpCircle,
    LogOut,
    Moon,
    Sun,
    Monitor,
    Eye,
    EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { toast } = useToast();

    const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
    const [language, setLanguage] = useState("en");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [gridSnap, setGridSnap] = useState(true);

    // Password change state
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleThemeChange = (value: string) => {
        setTheme(value as "light" | "dark" | "system");
        // Apply theme
        if (value === "dark") {
            document.documentElement.classList.add("dark");
        } else if (value === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            // System preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
        toast({
            title: "Theme updated",
            description: `Theme changed to ${value}`,
        });
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    const handleSave = () => {
        toast({
            title: "Settings saved",
            description: "Your preferences have been updated successfully.",
        });
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords don't match",
                description: "Please make sure your new passwords match.",
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                variant: "destructive",
                title: "Password too short",
                description: "Password must be at least 6 characters long.",
            });
            return;
        }

        setIsChangingPassword(true);

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        setIsChangingPassword(false);

        if (error) {
            toast({
                variant: "destructive",
                title: "Error changing password",
                description: error.message,
            });
        } else {
            toast({
                title: "Password changed",
                description: "Your password has been updated successfully.",
            });
            setPasswordDialogOpen(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 p-8 ml-20">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <SettingsIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Settings</h1>
                            <p className="text-muted-foreground">Manage your account and preferences</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Account Settings */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-muted-foreground" />
                                    <CardTitle>Account</CardTitle>
                                </div>
                                <CardDescription>Manage your account information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">{user?.email || "Not signed in"}</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
                                        Edit Profile
                                    </Button>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Password</p>
                                        <p className="text-sm text-muted-foreground">Last changed: Never</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setPasswordDialogOpen(true)}>
                                        Change Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Appearance */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Palette className="w-5 h-5 text-muted-foreground" />
                                    <CardTitle>Appearance</CardTitle>
                                </div>
                                <CardDescription>Customize how Design Genie looks</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Theme</p>
                                        <p className="text-sm text-muted-foreground">Select your preferred theme</p>
                                    </div>
                                    <Select value={theme} onValueChange={handleThemeChange}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">
                                                <div className="flex items-center gap-2">
                                                    <Sun className="w-4 h-4" />
                                                    Light
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="dark">
                                                <div className="flex items-center gap-2">
                                                    <Moon className="w-4 h-4" />
                                                    Dark
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="system">
                                                <div className="flex items-center gap-2">
                                                    <Monitor className="w-4 h-4" />
                                                    System
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Language</p>
                                        <p className="text-sm text-muted-foreground">Select your language</p>
                                    </div>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Español</SelectItem>
                                            <SelectItem value="fr">Français</SelectItem>
                                            <SelectItem value="de">Deutsch</SelectItem>
                                            <SelectItem value="hi">हिंदी</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Editor Settings */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <SettingsIcon className="w-5 h-5 text-muted-foreground" />
                                    <CardTitle>Editor</CardTitle>
                                </div>
                                <CardDescription>Customize editor behavior</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Auto-save</p>
                                        <p className="text-sm text-muted-foreground">Automatically save your work</p>
                                    </div>
                                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Snap to grid</p>
                                        <p className="text-sm text-muted-foreground">Align objects to grid when moving</p>
                                    </div>
                                    <Switch checked={gridSnap} onCheckedChange={setGridSnap} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-muted-foreground" />
                                    <CardTitle>Notifications</CardTitle>
                                </div>
                                <CardDescription>Manage your notification preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Email notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                                    </div>
                                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Push notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                                    </div>
                                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help & Support */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-muted-foreground" />
                                    <CardTitle>Help & Support</CardTitle>
                                </div>
                                <CardDescription>Get help and learn more</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Documentation</p>
                                        <p className="text-sm text-muted-foreground">Learn how to use Design Genie</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        View Docs
                                    </Button>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Send Feedback</p>
                                        <p className="text-sm text-muted-foreground">Help us improve the app</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Send Feedback
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sign Out */}
                        {user && (
                            <Card className="border-destructive/20">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <LogOut className="w-5 h-5 text-destructive" />
                                            <div>
                                                <p className="font-medium">Sign out</p>
                                                <p className="text-sm text-muted-foreground">Sign out of your account</p>
                                            </div>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={handleSignOut}>
                                            Sign Out
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Save Button */}
                        <div className="flex justify-end pt-4">
                            <Button onClick={handleSave} size="lg">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Dialog */}
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your new password below. Make sure it's at least 6 characters.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                            {isChangingPassword ? "Changing..." : "Change Password"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Settings;
