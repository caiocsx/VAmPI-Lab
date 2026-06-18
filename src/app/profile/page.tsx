import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ROUTES } from "@/config/api-routes";
import { api } from "@/lib/api";
import type { MeResponse } from "@/types/api";
import type { User } from "@/types/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const { data } = await api.get<MeResponse>(API_ROUTES.auth.me);
        const currentUser = data.data;

        setUser(currentUser);
        setEmail(currentUser.email);
      } catch (error) {
        toast.error("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateEmail = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!email.trim()) {
      toast.error("Enter a valid email address.");
      return;
    }

    try {
      setUpdatingEmail(true);

      await api.put(API_ROUTES.users.updateEmail(user.username), {
        email,
      });

      setUser((prev) => (prev ? { ...prev, email } : prev));
      toast.success("Email updated successfully.");
    } catch (error) {
      toast.error("Error updating email. Please try again later.");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!newPassword.trim()) {
      toast.error("Enter a valid password.");
      return;
    }

    try {
      setUpdatingPassword(true);

      await api.put(API_ROUTES.users.updatePassword(user.username), {
        password: newPassword,
      });

      setNewPassword("");
      toast.success("Password updated successfully.");
    } catch (error) {
      toast.error("Error updating password. Please try again later.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="animate-pulse text-sm text-muted-foreground">
          Loading profile information...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Could not load profile information. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View and update your account information below
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="font-medium">{user.username}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">{user.admin ? "Admin" : "User"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Change Email</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleUpdateEmail}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={updatingEmail}
                  className="w-1/2"
                >
                  {updatingEmail ? "Updating..." : "Save email"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleUpdatePassword}>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="*********"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={updatingPassword}
                  className="w-1/2"
                >
                  {updatingPassword ? "Updating..." : "Save password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
