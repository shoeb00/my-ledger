'use client';

import React from 'react';
import type { Transaction as Tx } from '@my-ledger/api/transaction';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DeleteTransactionDialog from '../[bookId]/components/delete-transaction';
import EditTransactionDialog from '../[bookId]/components/edit-transaction';
import { PaymentMethodEnum } from '../../enums/payment-methods';
import AddTransactionDialog from '../[bookId]/components/add-transaction';
import { fmtCurrency, fmtDate, useHasPermission } from '../../lib';
import { Roles } from '@my-ledger/api/role';

export type TransactionRow = {
  name: string,
  email: string
} & Tx;

export function TransactionRow({ tx, refetchAction }: { tx: TransactionRow; refetchAction: () => void }) {
  const canEdit = !useHasPermission(Roles.AUTHOR);

  const amountNum = fmtCurrency(tx.amount);
  const isDebit = amountNum[0] === '-';
  const displayAmount = isDebit ? amountNum.slice(1) : amountNum;

  return (
    <article
      role="listitem"
      aria-label={`Transaction ${tx.id}`}
      className="w-full rounded-lg border bg-card px-4 py-3 shadow-sm hover:shadow-md transition flex justify-between gap-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-30">
          <div className="text-sm font-medium truncate">{tx.description ?? '—'}</div>
          <div className="text-[8px] font-bold truncate">{tx.paymentType ?? '—'}</div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 md:hidden">
          <div className={`text-sm font-semibold ${isDebit ? 'text-destructive' : 'text-success'}`}>
            {isDebit ? '-' : ''}
            {displayAmount}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              hidden={canEdit}
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Badge className="text-xs px-4" variant={isDebit ? 'default' : 'outline'}>
        {' '}
        {isDebit ? 'Debit' : 'Credit'}{' '}
      </Badge>
      <div className="flex flex-col shrink-0">
        <div className="text-xs font-semibold capitalize">{tx.name}</div>
        <div className="text-xs text-muted-foreground">{tx.email}</div>
      </div>
      <div className="w-45 shrink-0">
        <div className="text-xs text-muted-foreground">{fmtDate(tx.createdAt)}</div>
      </div>

      <div
        className={`text-right text-sm font-semibold ${isDebit ? 'text-destructive' : 'text-success'} w-36`}
      >
        {isDebit ? '-' : ''}
        {displayAmount}
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
    <section className="h-85 overflow-auto space-y-2">
      {transactions.map(tx => (
        <TransactionRow key={tx.id} tx={tx} refetchAction={refetchAction} />
      ))}
    </section>
  );
}
