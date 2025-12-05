'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Transaction } from '@my-ledger/api/transaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { getTransaction } from './actions/get-transaction';
import TransactionList from '../components/transaction';
import { getBook } from '../actions/get-books';
import { Book } from '@my-ledger/api/book';
import { MoreVerticalIcon } from 'lucide-react';
import AddTransactionDialog from './components/add-transaction';
import LoaderCircle from '../../components/loader';

type paymentType = 'all' | 'debit' | 'credit';
type order = 'asc' | 'desc';

export type FetchParams = {
  bookId: string;
  limit: number;
  offset: number;
  sort?: string;
  order?: order;
  createdBefore?: string;
  createdAfter?: string;
  paymentType?: paymentType;
  description?: string;
  minAmount?: string;
  maxAmount?: string;
};

export default function PageClient() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // TODO: Handle errors with a toast
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: use useReducer and handle refresh
  const [query, setQuery] = useState('');
  const [paymentType, setPaymentType] = useState<paymentType>('all');
  const [createdAfter, setCreatedAfter] = useState<string | undefined>(undefined);
  const [createdBefore, setCreatedBefore] = useState<string | undefined>(undefined);
  const [minAmount, setMinAmount] = useState<string | undefined>(undefined);
  const [maxAmount, setMaxAmount] = useState<string | undefined>(undefined);
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [sort, setSort] = useState<string>('createdAt');
  const [order, setOrder] = useState<order>('desc');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [balance, setBalance] = useState('0');
  const [debited, setDebited] = useState('0');
  const [credited, setCredited] = useState('0');
  const [bookName, setBookName] = useState('');
  const [refetchTransactions, setRefetchTransactions] = useState(false);
  const [refetchBookDetails, setRefetchBookDetails] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const buildParams = useCallback((): FetchParams => {
    console.log('buildParams');
    const p: FetchParams = {
      bookId,
      limit,
      offset,
      sort,
      order,
    };
    if (debouncedQuery) p.description = debouncedQuery;
    if (paymentType && paymentType !== 'all') p.paymentType = paymentType as paymentType;
    if (createdAfter) p.createdAfter = createdAfter;
    if (createdBefore) p.createdBefore = createdBefore;
    if (minAmount) p.minAmount = minAmount;
    if (maxAmount) p.maxAmount = maxAmount;
    console.log('buildParams', p);
    return p;
  }, [
    bookId,
    limit,
    offset,
    sort,
    order,
    debouncedQuery,
    paymentType,
    createdAfter,
    createdBefore,
    minAmount,
    maxAmount,
  ]);

  const fetchTransactions = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    setError(null);

    try {
      const params = buildParams();
      const data = await getTransaction(params);
      setTransactions(data.data);
      setTotalCount(data.count);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions';
      console.error('fetchTransactions error', err);
      setError(message);
      if (message === 'status 403') router.push('/home');
    } finally {
      setLoading(false);
    }
  }, [bookId, buildParams, router]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refetchTransactions, refetchBookDetails]);

  useEffect(() => {
    (async () => {
      const res = await getBook(bookId);
      const data = res[0] as Book;
      setBalance(data.balance);
      setDebited(data.debited || '0');
      setCredited(data.credited || '0');
      setBookName(data.name);
    })();
  }, [bookId, refetchBookDetails]);

  const refetch = () => {
    setRefetchBookDetails(!refetchBookDetails);
    setRefetchTransactions(!refetchTransactions);
  };

  // pagination helpers
  const currentPage = Math.floor(offset / limit) + 1;
  const nextPage = () => setOffset(prev => prev + limit);
  const prevPage = () => setOffset(prev => Math.max(0, prev - limit));

  return (
    <div className="space-y-6">
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid gap-2">
          <h2 className="text-xl font-semibold">{bookName}</h2>
          <div className="flex gap-4 items-center text-sm text-muted-foreground">
            <div>
              Balance: <strong>{balance}</strong>
            </div>
            <div>
              Credited: <strong>{credited}</strong>
            </div>
            <div>
              Debited: <strong>{debited}</strong>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search description..."
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setOffset(0);
              }}
              className="min-w-[220px]"
            />
            <Select
              onValueChange={v => {
                setPaymentType(v as paymentType);
                setOffset(0);
              }}
            >
              <SelectTrigger aria-label="Payment Type" className="w-40">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {paymentType === 'all' ? 'Any type' : paymentType}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setQuery('');
                setPaymentType('all');
                setCreatedAfter(undefined);
                setCreatedBefore(undefined);
                setMinAmount(undefined);
                setMaxAmount(undefined);
                setOrder('desc');
                setSort('createdAt');
              }}
            >
              Reset
            </Button>

            <AddTransactionDialog bookId={bookId} refetchAction={refetch} />

            <div className="relative">
              <Button variant="outline" onClick={() => router.push(`/book/${bookId}/info`)}>
                <MoreVerticalIcon className="w-4 h-4"></MoreVerticalIcon>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Extra filters */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Created After</label>
          <Input
            type="date"
            value={createdAfter ?? ''}
            onChange={e => {
              setCreatedAfter(e.target.value || undefined);
              setOffset(0);
            }}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Created Before</label>
          <Input
            type="date"
            value={createdBefore ?? ''}
            onChange={e => {
              setCreatedBefore(e.target.value || undefined);
              setOffset(0);
            }}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Min amount</label>
          <Input
            type="number"
            value={minAmount ?? ''}
            onChange={e => {
              setMinAmount(e.target.value || undefined);
              setOffset(0);
            }}
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Max amount</label>
          <Input
            type="number"
            value={maxAmount ?? ''}
            onChange={e => {
              setMaxAmount(e.target.value || undefined);
              setOffset(0);
            }}
            placeholder="100000"
          />
        </div>
      </section>

      <section className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm">Sort</label>
          <Select
            onValueChange={v => {
              setSort(v);
              setOffset(0);
            }}
          >
            <SelectTrigger aria-label="Sort field" className="w-40">
              <div className="flex items-center gap-2">
                <span className="text-sm">{sort}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created At</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              {/* add your TransactionSortableFields here */}
            </SelectContent>
          </Select>
          <Select
            onValueChange={v => {
              setOrder(v as 'asc' | 'desc');
              setOffset(0);
            }}
          >
            <SelectTrigger aria-label="Order" className="w-[120px]">
              <div className="flex items-center gap-2">
                <span className="text-sm">{order}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm">Per page</label>
          <Select
            onValueChange={v => {
              setLimit(Number(v));
              setOffset(0);
            }}
          >
            <SelectTrigger aria-label="Per page" className="w-20">
              <div className="flex items-center gap-2">
                <span className="text-sm">{limit}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <LoaderCircle loading={loading}>
        <TransactionList bookId={bookId} transactions={transactions} refetchAction={refetch} />
      </LoaderCircle>

      <section className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button onClick={prevPage} disabled={offset === 0}>
            Prev
          </Button>
          <div>Page {currentPage}</div>
          <Button onClick={nextPage} disabled={totalCount < limit}>
            Next
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </div>
      </section>
    </div>
  );
}
