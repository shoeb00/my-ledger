"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTransaction } from "./actions/get-transaction";
import TransactionList, { TransactionRow } from "../components/transaction";
import { getBook } from "../actions/get-books";
import { Book } from "@my-ledger/api/book";
import { ChevronLeft, EllipsisVerticalIcon, SettingsIcon, XCircleIcon } from "lucide-react";
import AddTransactionDialog from "./components/add-transaction";
import LoaderCircle from "../../components/loader";
import { toast } from "sonner";
import { fmtCurrency, fmtDate } from "../../lib";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

type paymentType = "all" | "debit" | "credit";
type order = "asc" | "desc";

export type FetchParams = {
  bookId: string;
  limit: number;
  offset: number;
  sort?: string;
  order?: order;
  createdBefore?: string;
  createdAfter?: string;
  description?: string;
  minAmount?: string;
  maxAmount?: string;
};

export default function PageClient() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: use useReducer and handle refresh
  const [query, setQuery] = useState("");
  const [paymentType, setPaymentType] = useState<paymentType>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [minAmount, setMinAmount] = useState<string | undefined>(undefined);
  const [maxAmount, setMaxAmount] = useState<string | undefined>(undefined);
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<order>("desc");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [balance, setBalance] = useState("0");
  const [debited, setDebited] = useState("0");
  const [credited, setCredited] = useState("0");
  const [bookName, setBookName] = useState("");
  const [refetchTransactions, setRefetchTransactions] = useState(false);
  const [refetchBookDetails, setRefetchBookDetails] = useState(false);
  const [advanceSearch, setAdvanceSearch] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const buildParams = useCallback((): FetchParams => {
    const p: FetchParams = {
      bookId,
      limit,
      offset,
      sort,
      order,
    };
    if (debouncedQuery) p.description = debouncedQuery;
    if (dateRange?.from) p.createdAfter = dateRange.from.toISOString();
    if (dateRange?.to) p.createdBefore = dateRange.to.toISOString();
    if (minAmount) p.minAmount = minAmount;
    if (maxAmount) p.maxAmount = maxAmount;
    if (paymentType && paymentType !== "all") {
      if (paymentType === "debit") p.maxAmount = "0";
      if (paymentType === "credit") p.minAmount = "0";
    }
    return p;
  }, [
    bookId,
    limit,
    offset,
    sort,
    order,
    debouncedQuery,
    paymentType,
    dateRange,
    minAmount,
    maxAmount,
  ]);

  const fetchTransactions = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    const { err, data } = await getTransaction(buildParams());
    if (err) {
      toast.error(err);
    } else {
      setTransactions(data.data);
      setTotalCount(data.count);
    }
    setLoading(false);
  }, [bookId, buildParams]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refetchTransactions, refetchBookDetails]);

  useEffect(() => {
    (async () => {
      const { err, data: res } = await getBook(bookId);
      if (err) {
        toast.error(err);
      } else {
        const data = res[0] as Book;
        setBalance(data.balance);
        setDebited(data.debited || "0");
        setCredited(data.credited || "0");
        setBookName(data.name);
      }
    })();
  }, [bookId, refetchBookDetails]);

  const refetch = () => {
    setRefetchBookDetails(!refetchBookDetails);
    setRefetchTransactions(!refetchTransactions);
  };

  // TODO: scroll to the top on page change
  const currentPage = Math.floor(offset / limit) + 1;
  const nextPage = () => setOffset(prev => prev + limit);
  const prevPage = () => setOffset(prev => Math.max(0, prev - limit));

  return (
    <div className="sm:space-y-2 md:space-y-6 w-full flex flex-col min-h-[calc(100vh-140px)]">
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="grid gap-2">
          <div className="flex flex-row items-center gap-2">
            <Button variant={"outline"} onClick={() => router.push("/home")}>
              <ChevronLeft />
            </Button>
            <h2 className="text-xl truncate font-semibold">{bookName}</h2>
          </div>
          <div className="flex gap-4 items-center text-sm text-muted-foreground">
            <span>
              Balance:{" "}
              <strong
                className={cn(
                  "whitespace-nowrap",
                  Number(balance) > 0
                    ? "text-green-600"
                    : Number(balance) < 0
                      ? "text-destructive"
                      : "",
                )}
              >
                {fmtCurrency(balance, true)}
              </strong>
            </span>
            <span>
              Credited: <strong className="text-blue-600">{fmtCurrency(credited)}</strong>
            </span>
            <span>
              Debited: <strong className="text-destructive">{fmtCurrency(debited)}</strong>
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex flex-row-reverse gap-2 w-full">
            <Button
              variant={advanceSearch ? "destructive" : "outline"}
              onClick={() => setAdvanceSearch(!advanceSearch)}
            >
              {!advanceSearch ? <EllipsisVerticalIcon /> : <XCircleIcon />}
            </Button>
            <Button
              onClick={() => {
                setQuery("");
                setPaymentType("all");
                setDateRange({ from: undefined, to: undefined });
                setMinAmount(undefined);
                setMaxAmount(undefined);
                setOrder("desc");
                setSort("createdAt");
              }}
              hidden={!advanceSearch}
            >
              Reset
            </Button>
            <Select
              onValueChange={v => {
                setPaymentType(v as paymentType);
                setOffset(0);
              }}
            >
              <SelectTrigger aria-label="Payment Type" className="min-w-25 w-fit">
                <SelectValue placeholder="Transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search description..."
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setOffset(0);
              }}
              className="min-w-10 w-fit"
            />
          </div>
          <div className="flex flex-row-reverse gap-2 w-full mb-2">
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => router.push(`/book/${bookId}/settings`)}
            >
              <SettingsIcon className="w-4 h-4"></SettingsIcon>
            </Button>
            <AddTransactionDialog bookId={bookId} refetchAction={refetch} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-3" hidden={!advanceSearch}>
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground">Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {fmtDate(dateRange.from, false)} -{" "}
                      {fmtDate(dateRange.to, false)}
                    </>
                  ) : (
                    fmtDate(dateRange.from, false)
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                autoFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  setOffset(0);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Min amount</label>
          <Input
            type="number"
            value={minAmount ?? ""}
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
            value={maxAmount ?? ""}
            onChange={e => {
              setMaxAmount(e.target.value || undefined);
              setOffset(0);
            }}
            placeholder={fmtCurrency("10000000")}
          />
        </div>
      </section>

      <section className="flex items-center gap-4" hidden={!advanceSearch}>
        <div className="flex items-center gap-2 my-2">
          <Select
            onValueChange={v => {
              setSort(v);
              setOffset(0);
            }}
            defaultValue="createdAt"
          >
            <SelectTrigger aria-label="Sort field" className="min-w-20">
              <SelectValue placeholder="Sorting fields" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="createdAt">Created At</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={v => {
              setOrder(v as order);
              setOffset(0);
            }}
            defaultValue="desc"
          >
            <SelectTrigger aria-label="Order" className="min-w-10">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-[11px] sm:text-sm">Per page</label>
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
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <LoaderCircle loading={loading}>
        <TransactionList bookId={bookId} transactions={transactions} refetchAction={refetch} />
      </LoaderCircle>

      <section className="flex items-center justify-between mt-auto pt-4 border-t">
        <div className="flex items-center gap-2">
          <Button onClick={prevPage} disabled={offset === 0 || loading}>
            Prev
          </Button>
          <div>Page {currentPage}</div>
          <Button onClick={nextPage} disabled={totalCount <= offset + limit || loading}>
            Next
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {totalCount} {totalCount === 1 ? "item" : "items"}
        </div>
      </section>
    </div>
  );
}
