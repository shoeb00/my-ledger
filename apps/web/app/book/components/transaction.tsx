'use client';

import React from 'react';
import type { Transaction as Tx } from '@my-ledger/api/transaction';
import DeleteTransactionDialog from '../[bookId]/components/delete-transaction';
import EditTransactionDialog from '../[bookId]/components/edit-transaction';
import { PaymentMethodEnum } from '../../enums/payment-methods';
import AddTransactionDialog from '../[bookId]/components/add-transaction';
import { fmtCurrency, fmtDate } from '../../lib';

export type TransactionRow = {
  name: string,
  email: string
} & Tx;

export function TransactionRow({ tx, refetchAction }: { tx: TransactionRow; refetchAction: () => void }) {
  return (
    <article
      role="listitem"
      aria-label={`Transaction ${tx.id}`}
      className="w-full rounded-lg border bg-card px-4 py-3 shadow-sm hover:shadow-md transition flex justify-between"
    >
      <div
        className={`text-right text-sm font-semibold ${+tx.amount < 0 ? 'text-destructive' : 'text-success'} w-20`}
      >
        {fmtCurrency(tx.amount, true)}
      </div>
      <div className="w-100 overflow-hidden">
        <div className="text-sm font-medium truncate">{tx.description ?? '—'}</div>
        <div className="text-[8px] font-bold truncate">{tx.paymentType ?? '—'}</div>
      </div>
      <div className="flex flex-col shrink-0">
        <div className="text-xs font-semibold capitalize">{tx.name}</div>
        <div className="text-xs text-muted-foreground">{tx.email}</div>
      </div>
      <div className="w-45 shrink-0">
        <div className="text-xs text-muted-foreground">{fmtDate(tx.createdAt)}</div>
      </div>
      <div className="flex items-center gap-2">
        <EditTransactionDialog
          bookId={tx.bookId.toString()}
          transactionId={tx.id.toString()}
          description={tx.description ?? ''}
          paymentType={(tx.paymentType as PaymentMethodEnum) ?? PaymentMethodEnum.OTHER}
          refetchAction={refetchAction}
        />
        <DeleteTransactionDialog
          bookId={tx.bookId.toString()}
          transactionId={tx.id.toString()}
          refetchAction={refetchAction}
        />
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
  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-md border border-dashed h-85 p-6 text-center text-sm text-muted-foreground">
        <div className="mb-2 font-medium">No transactions yet</div>
        <div className="mb-4 text-xs">Create a transaction to see it listed here.</div>
        <AddTransactionDialog bookId={bookId} refetchAction={refetchAction} />
      </div>
    );
  }

  return (
    <section className="shrink-0 overflow-scroll space-y-2">
      {transactions.map(tx => (
        <TransactionRow key={tx.id} tx={tx} refetchAction={refetchAction} />
      ))}
    </section>
  );
}
