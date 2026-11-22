"use client";
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import BookCard from "./components/book";
import LoaderCircle from "../components/loader";
import { toast } from "sonner";
import CreateBook from "../book/create-book";
import { Roles } from "@my-ledger/db/schema";
import { acceptInvite, getUser } from "../invite/[token]/actions/invite";
import { useClerk } from "@clerk/nextjs";
import { useRolesContext } from "../context";

enum SortOptions {
  LastEntry = "last-entry",
  Newest = "newest",
  Oldest = "oldest",
  BalanceDesc = "balance-desc",
  BalanceAsc = "balance-asc",
}

export default function Home() {
  const { roles: books, loading, refetchRoles } = useRolesContext();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { user } = useClerk();
  const inviteHandledRef = useRef(false);
  const [waitingForRegistration, setWaitingForRegistration] = useState(false);

  const pollUntilRegistered = async (userId: string, token: string) => {
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
      attempts++;
      const { err } = await getUser(userId);
      if (!err) {
        const { err: inviteErr, data } = await acceptInvite(token);
        if (inviteErr) {
          if (!inviteErr.includes("already accepted")) toast.error(inviteErr);
          else await refetchRoles();
        } else {
          toast.success(data?.message || "Invitation accepted");
          await refetchRoles();
        }
        window.localStorage.removeItem("inviteToken");
        setWaitingForRegistration(false);
        return;
      }
      await new Promise((res) => setTimeout(res, 1000));
    }

    setWaitingForRegistration(false);
    toast.error("We couldn't verify your account. Please refresh.");
  };

  useEffect(() => {
    if (!user?.id) return;
    const inviteToken = window.localStorage.getItem("inviteToken");
    if (!inviteToken || inviteHandledRef.current) return;
    inviteHandledRef.current = true;
    setWaitingForRegistration(true);
    pollUntilRegistered(user.id, inviteToken);
  }, [user]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const [sort, setSort] = useState<SortOptions>(SortOptions.LastEntry);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    [],
  );

  const filtered = useMemo(() => {
    const list = books.filter((b) =>
      `${b.name} ${b.description ?? ""}`
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase()),
    );

    switch (sort) {
      case SortOptions.LastEntry:
        return [...list].sort(
          (a, z) =>
            +new Date(z.lastTransaction || z.createdAt) -
            +new Date(a.lastTransaction || a.createdAt),
        );
      case SortOptions.Newest:
        return [...list].sort(
          (a, z) => +new Date(z.createdAt) - +new Date(a.createdAt),
        );
      case SortOptions.Oldest:
        return [...list].sort(
          (a, z) => +new Date(a.createdAt) - +new Date(z.createdAt),
        );
      case SortOptions.BalanceDesc:
        return [...list].sort((a, z) => Number(z.balance) - Number(a.balance));
      case SortOptions.BalanceAsc:
        return [...list].sort((a, z) => Number(a.balance) - Number(z.balance));
      default:
        return list;
    }
  }, [books, debouncedQuery, sort]);

  let booksCount = 0;
  books.forEach(({ role }) => (role === Roles.AUTHOR ? booksCount++ : null));

  return (
    <div>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Books</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All your books and quick stats
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto max-sm:flex-col">
          <div className="flex max-sm:w-full max-sm:pl-2 justify-between gap-2 flex-none">
            <Input
              value={query}
              onChange={handleInputChange}
              placeholder="Search books..."
              aria-label="Search books"
              className="min-w-0"
            />
            <Button
              variant={query.length ? "destructive" : "secondary"}
              className="inline-flex"
              onClick={() => setQuery("")}
            >
              Clear
            </Button>
          </div>
          <div className="flex justify-between w-full">
            <Select value={sort} onValueChange={(v) => setSort(v as SortOptions)}>
              <SelectTrigger aria-label="Sort books" className="ml-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm capitalize">{sort.replaceAll("-", " ")}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.values(SortOptions).map((s) => (
                  <SelectItem
                    className="capitalize"
                    key={s}
                    value={s}
                  >
                    {s.replaceAll("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateBook books={booksCount} />
          </div>
        </div>
      </header>

      <LoaderCircle loading={loading || waitingForRegistration}>
        <div className="min-h-100">
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </section>

          {!loading && filtered.length === 0 && (
            <div className="mt-8">
              <Card
                className="p-6 text-center"
                style={{ background: "hsl(var(--card))" }}
              >
                <CardTitle>No books found</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Try different keywords or create a new book.
                </p>
                <div className="mt-4 flex justify-center">
                  <CreateBook books={booksCount} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </LoaderCircle>
    </div>
  );
}
