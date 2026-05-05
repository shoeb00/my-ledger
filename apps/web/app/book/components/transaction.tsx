'use client';

import React from 'react';
import { Transaction, Roles } from '@my-ledger/db/schema';
import DeleteTransactionDialog from '../[bookId]/components/delete-transaction';
import EditTransactionDialog from '../[bookId]/components/edit-transaction';
import AddTransactionDialog from '../[bookId]/components/add-transaction';
import { fmtCurrency, fmtDate, useHasPermission } from '../../lib';
import UploadTransactionFile from '../[bookId]/components/upload-transaction-file';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type TransactionRow = {
  name: string;
  email: string;
  paymentMethodName?: string | null;
  categoryName?: string | null;
} & Transaction;

export function TransactionRow({
  tx,
  refetchAction,
}: {
  tx: TransactionRow;
  refetchAction: () => void;
}) {
  return (
    <article
      role="listitem"
      aria-label={`Transaction ${tx.id}`}
      className="w-full rounded-lg border bg-card px-4 py-3 shadow-sm hover:shadow-md transition"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[80px_1fr_120px_120px_180px_120px_auto] sm:items-center">
        <div
          className={`sm:col-start-1 text-sm font-semibold sm:text-left ${+tx.amount < 0 ? 'text-destructive' : 'text-success'}`}
        >
          {fmtCurrency(tx.amount, true)}
        </div>

        <div className="sm:col-start-2 overflow-hidden text-sm font-medium truncate">{tx.description}</div>

        <div className="flex flex-row gap-2 sm:contents">
          <Badge
            variant="outline"
            hashString={tx.paymentMethodName}
            className={cn('border truncate sm:col-start-3', tx.paymentMethodName ? '' : 'hidden')}
          >
            {tx.paymentMethodName}
          </Badge>
          <Badge
            variant="outline"
            hashString={tx.categoryName}
            className={cn('border truncate sm:col-start-4', tx.categoryName ? '' : 'hidden')}
          >
            {tx.categoryName}
          </Badge>
        </div>


        <div className="sm:col-start-5 flex flex-col text-xs">
          <span className="font-semibold capitalize text-foreground truncate">{tx.name}</span>
          <span className="text-muted-foreground truncate">{tx.email}</span>
        </div>

        <div className="sm:col-start-6 text-xs text-muted-foreground">{fmtDate(tx.createdAt)}</div>

        <div className="flex items-center gap-2 justify-end">
          <EditTransactionDialog
            bookId={tx.bookId.toString()}
            transactionId={tx.id.toString()}
            description={tx.description ?? ''}
            paymentMethodId={tx.paymentMethodId ?? null}
            categoryId={tx.categoryId ?? null}
            createdAt={new Date(tx.createdAt)}
            refetchAction={refetchAction}
          />
          <DeleteTransactionDialog
            bookId={tx.bookId.toString()}
            transactionId={tx.id.toString()}
            refetchAction={refetchAction}
          />
        </div>
      </div>
    </article>
  );
}

export default function TransactionList({
  bookId,
  transactions,
  refetchAction,
}: {
  bookId: string;
  transactions: TransactionRow[];
  refetchAction: () => void;
}) {
  const hasPermission = useHasPermission(Roles.AUTHOR);
  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-md border border-dashed h-full p-6 text-center text-sm text-muted-foreground">
        <div className="mb-2 font-medium">No transactions yet</div>
        <div className="mb-4 text-xs">Create a transaction to see it listed here.</div>
        <div className="flex flex-col gap-2 items-center">
          <UploadTransactionFile
            refetchAction={refetchAction}
            hidden={!hasPermission}
            showName={true}
          />
          <AddTransactionDialog bookId={bookId} refetchAction={refetchAction} />
        </div>
      </div>
    );
  }

  return (
    <section className="shrink-0 overflow-auto space-y-2">
      {transactions.map(tx => (
        <TransactionRow key={tx.id} tx={tx} refetchAction={refetchAction} />
      ))}
    </section>
  );
}
