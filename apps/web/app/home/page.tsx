'use client';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import BookCard from './components/book';
import LoaderCircle from '../components/loader';
import { toast } from 'sonner';
import { BookResponse, getBook } from '../book/actions/get-books';
import CreateBook from '../book/create-book';
import { Roles } from '@my-ledger/api/role';

enum SortOptions {
  Newest = 'newest',
  Oldest = 'oldest',
  BalanceDesc = 'balance-desc',
  BalanceAsc = 'balance-asc',
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [refetchAction, setRefetchAction] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { err, data } = await getBook();
      if (err) {
        toast.error(err);
      } else {
        setBooks(data);
      }
      setLoading(false);
    })();
  }, [refetchAction]);

  const [sort, setSort] = useState<SortOptions>(SortOptions.Newest);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const filtered = useMemo(() => {
    const list = books.filter(b =>
      `${b.name} ${b.description ?? ''}`.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    switch (sort) {
      case SortOptions.Newest:
        return [...list].sort((a, z) => +new Date(z.createdAt) - +new Date(a.createdAt));
      case SortOptions.Oldest:
        return [...list].sort((a, z) => +new Date(a.createdAt) - +new Date(z.createdAt));
      case SortOptions.BalanceDesc:
        return [...list].sort((a, z) => Number(z.balance) - Number(a.balance));
      case SortOptions.BalanceAsc:
        return [...list].sort((a, z) => Number(a.balance) - Number(z.balance));
      default:
        return list;
    }
  }, [books, debouncedQuery, sort]);

  let booksCount = 0
  books.forEach(({ role }) => role === Roles.AUTHOR ? booksCount++ : null);

  return (
    <div>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Books</h1>
          <p className="text-sm text-muted-foreground mt-1">All your books and quick stats</p>
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
            <Button variant={query.length ? "destructive" : "secondary"} className="inline-flex" onClick={() => setQuery('')}>
              Clear
            </Button>
          </div>
          <div className="flex justify-between w-full">
            <Select onValueChange={v => setSort(v as SortOptions)}>
              <SelectTrigger aria-label="Sort books" className="ml-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="balance-desc">Balance (High → Low)</SelectItem>
                <SelectItem value="balance-asc">Balance (Low → High)</SelectItem>
              </SelectContent>
            </Select>
            <CreateBook
              books={booksCount}
              refetchAction={() => setRefetchAction(!refetchAction)}
            />
          </div>
        </div>
      </header>

      <LoaderCircle loading={loading}>
        <div className="min-h-100">
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(b => (
              <BookCard key={b.id} book={b} />
            ))}
          </section>

          {!loading && filtered.length === 0 && (
            <div className="mt-8">
              <Card className="p-6 text-center" style={{ background: 'hsl(var(--card))' }}>
                <CardTitle>No books found</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Try different keywords or create a new book.
                </p>
                <div className="mt-4 flex justify-center">
                  <CreateBook
                    books={booksCount}
                    refetchAction={() => setRefetchAction(!refetchAction)}
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      </LoaderCircle>
    </div>
  );
}
