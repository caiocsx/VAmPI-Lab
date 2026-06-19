import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_ROUTES } from "@/config/api-routes";
import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function WritersPage() {
  const [writers, setWriters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        setLoading(true);

        const usersReq = await api.get(API_ROUTES.users.list);
        const allUsers: User[] = usersReq.data?.users || [];

        setWriters(allUsers);
      } catch (err) {
        toast.error("Failed to load writers data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWriters();
  }, []);

  const handleSearchUser = async () => {
    if (!searchUsername.trim()) {
      toast.error("Enter a username.");
      return;
    }

    try {
      setSearching(true);

      const { data } = await api.get(
        API_ROUTES.users.get(searchUsername.trim())
      );

      setWriters([data]);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast.error("User not found.");
      } else {
        toast.error("Failed to search user.");
      }
    } finally {
      setSearching(false);
    }
  };

  const handleResetSearch = async () => {
    try {
      setSearching(true);

      const usersReq = await api.get(API_ROUTES.users.list);

      setWriters(usersReq.data?.users || []);
      setSearchUsername("");
    } catch {
      toast.error("Failed to reload users.");
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="animate-pulse text-sm text-muted-foreground">
          Loading writers...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Writers</h1>
        <p className="text-muted-foreground">
          List of all registered writers in the system.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Total Registered Writers
            </p>
            <h3 className="text-3xl font-bold tracking-tight">
              {writers.length}
            </h3>
          </div>
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Search by username..."
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchUser();
            }
          }}
        />

        <Button onClick={handleSearchUser} disabled={searching}>
          Search
        </Button>

        <Button
          variant="outline"
          onClick={handleResetSearch}
          disabled={searching}
        >
          Clear
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-4 pb-4">
          <div className="space-y-0.5">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Users className="h-4 w-4 text-muted-foreground" />
              All Writers Accounts
            </h2>
            <p className="text-xs text-muted-foreground">
              All member profiles registered in the system.
            </p>
          </div>
        </div>

        <div className="px-4 py-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {writers.length > 0 ? (
                writers.map((user, idx) => (
                  <TableRow key={`${user.email}-${idx}`}>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No writers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
