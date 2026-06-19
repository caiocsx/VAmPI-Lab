import { API_ROUTES } from "@/config/api-routes";
import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { BookOpen, Eye, Plus, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  BookDetailsResponse,
  BooksResponse,
  MeResponse,
} from "@/types/api";
import type { Book, BookDetails } from "@/types/book";

export function BooksPage() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [secret, setSecret] = useState("");
  const [creating, setCreating] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchBooks = async () => {
    const [booksReq, meReq] = await Promise.all([
      api.get<BooksResponse>(API_ROUTES.books.list),
      api.get<MeResponse>(API_ROUTES.auth.me),
    ]);

    setAllBooks(booksReq.data.Books ?? []);
    setCurrentUser(meReq.data.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchBooks();
      } catch {
        toast.error("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const myBooks = useMemo(() => {
    if (!currentUser) return [];
    return allBooks.filter((book) => book.user === currentUser.username);
  }, [allBooks, currentUser]);

  const handleCreateBook = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!bookTitle.trim() || !secret.trim()) {
      toast.error("Please provide both a book title and a secret.");
      return;
    }

    try {
      setCreating(true);

      await api.post(API_ROUTES.books.create, {
        book_title: bookTitle,
        secret,
      });

      toast.success("Book created successfully!");
      setBookTitle("");
      setSecret("");
      setCreateOpen(false);

      await fetchBooks();
    } catch {
      toast.error("Failed to create book. Please try again later.");
    } finally {
      setCreating(false);
    }
  };

  const handleViewSecret = async (title: string) => {
    try {
      setLoadingDetails(true);

      const { data } = await api.get<BookDetailsResponse>(
        API_ROUTES.books.get(title)
      );

      setSelectedBook({
        book_title: data.book_title ?? title,
        owner: data.owner ?? "",
        secret: data.secret ?? "",
      });

      setDetailsOpen(true);
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401) {
        toast.error("You are not authorized to view this secret.");
      } else if (status === 404) {
        toast.error("Book not found.");
      } else {
        toast.error("Failed to load book details.");
      }
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="animate-pulse text-sm text-muted-foreground">
          Loading books...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Books</h1>
        <p className="text-muted-foreground">
          View all books and manage your own publications.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Total Books Cataloged
            </p>
            <h3 className="text-3xl font-bold tracking-tight">
              {allBooks.length}
            </h3>
          </div>
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All books</TabsTrigger>
            <TabsTrigger value="mine">My books</TabsTrigger>
          </TabsList>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create book
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new book</DialogTitle>
                <DialogDescription>
                  Add a title and a secret content for the book.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleCreateBook}>
                <div className="space-y-2">
                  <Label htmlFor="book_title">Book title</Label>
                  <Input
                    id="book_title"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="book99"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret">Secret</Label>
                  <Input
                    id="secret"
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="pass1secret"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="all">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b p-4">
              <div className="space-y-0.5">
                <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  All books
                </h2>
                <p className="text-xs text-muted-foreground">
                  Every book registered in the system.
                </p>
              </div>
            </div>

            <div className="px-4 py-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Owner / Publisher</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allBooks.length > 0 ? (
                    allBooks.map((book, idx) => (
                      <TableRow key={`${book.book_title}-${idx}`}>
                        <TableCell className="font-medium text-primary">
                          {book.book_title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {book.user}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSecret(book.book_title)}
                            disabled={loadingDetails}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View secret
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No books found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mine">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b p-4">
              <div className="space-y-0.5">
                <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  My books
                </h2>
                <p className="text-xs text-muted-foreground">
                  Books published by your account.
                </p>
              </div>
            </div>

            <div className="px-4 py-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Owner / Publisher</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myBooks.length > 0 ? (
                    myBooks.map((book, idx) => (
                      <TableRow key={`${book.book_title}-${idx}`}>
                        <TableCell className="font-medium text-primary">
                          {book.book_title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {book.user}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSecret(book.book_title)}
                            disabled={loadingDetails}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View secret
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="py-10 text-center text-muted-foreground"
                      >
                        You do not have any books yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book secret</DialogTitle>
            <DialogDescription>
              Secret content for the selected book.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{selectedBook?.book_title ?? "-"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Owner</p>
              <p className="font-medium">{selectedBook?.owner ?? "-"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Secret</p>
              <p className="bg- rounded-md border bg-muted p-3 text-sm break-all">
                {selectedBook?.secret ?? "-"}
              </p>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
