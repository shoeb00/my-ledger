import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { BookResponse } from '../../book/actions/get-books';
import { fmtCurrency, fmtDate } from '../../lib';
import { cn } from '@/lib/utils';

export default function BookCard({ book }: Readonly<{ book: Readonly<BookResponse> }>) {
  const router = useRouter();

  const getInitials = (name: string) => {
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  };
  return (
    <Card
      key={book.id}
      onClick={() => router.push(`/book/${book.id}`)}
      className="cursor-pointer p-4 transition hover:shadow-xl"
    >
      <CardHeader className="px-0 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Current balance</p>
            <div
              className={cn(
                'text-xl font-semibold leading-tight',
                Number(book.balance) > 0
                  ? 'text-green-600'
                  : Number(book.balance) < 0
                    ? 'text-destructive'
                    : '',
              )}
            >
              {fmtCurrency(book.balance, true)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Updated {fmtDate(book.lastTransaction ?? book.updatedAt ?? book.createdAt)}
            </p>
          </div>

          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials(book.name)}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="px-0 space-y-3">
        <div>
          <CardTitle className="text-sm font-medium capitalize truncate">{book.name}</CardTitle>
          <div className="h-[3em]">
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{book.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant={book.role}>
              {book.role}
            </Badge>
            <Badge variant="secondary" hidden={book.members <= 1}>
              {book.members} members
            </Badge>
          </div>

          <span className="text-xs text-muted-foreground">View →</span>
        </div>
      </CardContent>
    </Card>
  );
}
