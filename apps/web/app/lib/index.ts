import { ROLE_RANK, Roles } from '@my-ledger/api/role';
import { useParams } from 'next/navigation';
import { useRolesContext } from '../context';

const getCurrencySymbol = (locale = 'en-IN') => (locale === 'en-US' ? '$' : '₹');

export const fmtCurrency = (value: string, allowNegative = false, locale = 'en-IN') => {
  const symbol = getCurrencySymbol(locale);
  const val = Number(value.replace(/,/g, '').replace(/${symbol}/g, '')) || 0;
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(val)
    .replace('-', '');
  const isNegative = val < 0 && allowNegative ? '-' : '';
  return formatted === '0' ? `${symbol}0.00` : `${isNegative}${symbol}${formatted}`;
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

export const parseIST = (dateStr: string, timeStr: string) => {
  const [day, mon, year] = dateStr.split(' ');
  const monthIndex = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ].indexOf(mon!);
  const [timePart, meridiem] = timeStr.split(' ');
  const [hh, mm] = timePart!.split(':').map(Number);

  let hour = hh! % 12;
  if (meridiem === 'PM') hour += 12;

  const utcYear = Number(year);
  const utcMonth = monthIndex;
  const utcDay = Number(day);
  const utcHour = hour - 5;
  const utcMinute = mm! - 30;

  return new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHour, utcMinute));
};
