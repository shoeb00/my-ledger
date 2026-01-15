import { ROLE_RANK, Roles } from '@my-ledger/api/role';
import { useParams } from 'next/navigation';
import { useRolesContext } from '../context';

export const fmtCurrency = (value: string, locale = 'en-IN') => {
  const val = Number(value.replace(/,/g, '').replace(/₹/g, '')) || 0;
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val);
  return formatted === '0' ? '₹' : `₹${formatted}`;
};

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

export const useHasPermission = (requiredPermission: Roles) => {
  const params = useParams();
  const bookId = params.bookId as string;
  const role = useRolesContext(bookId).role as Roles;
  const rank = ROLE_RANK[role];
  const requireRank = ROLE_RANK[requiredPermission];
  return rank >= requireRank;
};
