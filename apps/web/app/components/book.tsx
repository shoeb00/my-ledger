import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from '@my-ledger/api/book';

import React from 'react';

const fmtCurrency = (value: string) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
};

const fmtDate = (d: string | Date) => {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function BookCard({ book }: Readonly<{ book: Readonly<Book> }>) {
  return (
    <Card
      key={book.id}
      className="shadow-sm overflow-hidden"
      style={{
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        borderRadius: 'var(--radius)',
      }}
    >
      <CardHeader className="flex items-start justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{book.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{book.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{book.description}</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-sm font-medium">{fmtCurrency(book.balance)}</div>
          <div className="text-xs text-muted-foreground mt-1">{fmtDate(book.createdAt)}</div>
        </div>
      </CardHeader>

      <CardContent className="p-4 border-t" style={{ borderTopColor: 'hsl(var(--border))' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">Credited</div>
            <div className="text-sm font-medium">{fmtCurrency(book.credited ?? '0')}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">Debited</div>
            <div className="text-sm font-medium">{fmtCurrency(book.debited ?? '0')}</div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">{book.members ?? 0} members</Badge>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            Last updated {fmtDate(book.updatedAt ?? book.createdAt)}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              View
            </Button>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
