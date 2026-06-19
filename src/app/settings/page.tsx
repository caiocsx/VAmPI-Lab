import { useTheme } from "@/components/theme-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon } from "lucide-react";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <h2 className="font-semibold">Dark mode</h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Toggle between light and dark themes.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode">{isDark ? "Dark" : "Light"}</Label>

            <Switch
              id="dark-mode"
              checked={isDark}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
