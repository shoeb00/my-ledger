import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

import React from 'react';
import { BookResponse } from '../book/actions/get-books';
import { EllipsisVerticalIcon } from 'lucide-react';

export const fmtCurrency = (value: string, locale = 'en-IN') => {
  const val = Number(value.replace(/,/g, '')) || 0;
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val);
  return formatted === '0' ? '' : formatted;
}

export const fmtDate = (d: string | Date, locale = 'en-IN', tz = 'Asia/Kolkata'): string => {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: tz,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
};

export default function BookCard({ book }: Readonly<{ book: Readonly<BookResponse> }>) {
  const router = useRouter();
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
            <Badge variant="outline">{book.members ?? 0} members</Badge>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            Last updated {fmtDate(book.lastTransaction ?? book.updatedAt ?? book.createdAt)}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/book/${book.id}`)}>
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/book/${book.id}/settings`)}
            >
              <EllipsisVerticalIcon />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
