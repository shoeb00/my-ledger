import { ROLE_RANK, Roles } from '@my-ledger/api/role';
import { useParams } from 'next/navigation';
import { useBookRole } from '../context';

const getCurrencySymbol = (locale = 'en-IN') => (locale === 'en-US' ? '$' : '₹');

export const fmtCurrency = (value: string, allowNegative = false, locale = 'en-IN') => {
  const symbol = getCurrencySymbol(locale);
  const val = Number(value.replace(/[^\d.]/g, '')) || 0;
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(val)
    .replace('-', '');
  const isNegative = value.includes('-') && allowNegative ? '-' : '';
  return formatted === '0' ? `${symbol}0` : `${isNegative}${symbol}${formatted}`;
};

export const fmtDate = (
  d: string | Date,
  fullDate = true,
  locale = 'en-IN',
  tz = 'Asia/Kolkata',
): string => {
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (!dt || isNaN(dt.getTime())) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: tz,
  };
  if (fullDate) {
    options.weekday = 'short';
    options.hour = 'numeric';
    options.minute = 'numeric';
  }
  return dt.toLocaleDateString(locale, options);
};

export const useHasPermission = (requiredPermission: Roles) => {
  const params = useParams();
  const bookId = params.bookId as string;
  const role = useBookRole(bookId).role as Roles;
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
