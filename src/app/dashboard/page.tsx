import { API_ROUTES } from "@/config/api-routes";
import { api } from "@/lib/api";
import { BookOpen, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Book } from "@/types/book";
import type { User } from "@/types/user";

export function DashboardPage() {
  const [stats, setStats] = useState({
    writersCount: 0,
    booksCount: 0,
    recentWriters: [] as User[],
    recentBooks: [] as Book[],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const usersReq = await api.get(API_ROUTES.users.list);
        const booksReq = await api.get(API_ROUTES.books.list);

        const allUsers: User[] = usersReq.data?.users || [];
        const allBooks: Book[] = booksReq.data?.Books || [];

        const latestUsers = [...allUsers].reverse().slice(0, 3);
        const latestBooks = [...allBooks].reverse().slice(0, 3);

        setStats({
          writersCount: allUsers.length,
          booksCount: allBooks.length,
          recentWriters: latestUsers,
          recentBooks: latestBooks,
        });
      } catch (err) {
        toast.error("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="animate-pulse text-sm text-muted-foreground">
          Loading overview metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground">
          Real-time metrics, system counters, and recent application activity
          logs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Registered Writers
              </p>
              <h3 className="text-3xl font-bold tracking-tight">
                {stats.writersCount}
              </h3>
            </div>
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Books Cataloged
              </p>
              <h3 className="text-3xl font-bold tracking-tight">
                {stats.booksCount}
              </h3>
            </div>
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-4 pb-4">
            <div className="space-y-0.5">
              <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Recent Writers Accounts
              </h2>
              <p className="text-xs text-muted-foreground">
                The latest member profiles registered in the system.
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
                {stats.recentWriters.length > 0 ? (
                  stats.recentWriters.map((user, idx) => (
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
                      colSpan={2}
                      className="text-center text-muted-foreground"
                    >
                      No recent writers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-4 pb-4">
            <div className="space-y-0.5">
              <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Latest Book Publications
              </h2>
              <p className="text-xs text-muted-foreground">
                The most recent book volumes uploaded into the database.
              </p>
            </div>
          </div>

          <div className="px-4 py-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Owner / Publisher</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentBooks.length > 0 ? (
                  stats.recentBooks.map((book, idx) => (
                    <TableRow key={`${book.book_title}-${idx}`}>
                      <TableCell className="font-medium text-primary">
                        {book.book_title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {book.user}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center text-muted-foreground"
                    >
                      No recent books found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
