import { ROLE_RANK, Roles } from '@my-ledger/api/role';
import { useParams } from 'next/navigation';
import { useBookRole } from '../context';
import { TZDateMini } from '@date-fns/tz';
import { format } from 'date-fns'
import { UTCDate } from '@date-fns/utc'

const getUserTz = () => {
  // TODO: get from user profile
  return 'Asia/Kolkata';
}
const DATE_TIME_FORMAT = "EEE, d MMM, yyyy, h:mm a";
const DATE_FORMAT = "EEE, d MMM, yyyy";
const TIME_FORMAT = "HH:mm";

const zoned = new TZDateMini(new Date(), getUserTz())
const formatted = format(zoned, DATE_TIME_FORMAT);
console.log(format(zoned, DATE_FORMAT));

console.log(new UTCDate(formatted).toISOString(), new Date().toISOString())
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
) => {
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (!dt || isNaN(dt.getTime())) return '';
  const zoned = new TZDateMini(dt, getUserTz())
  const formatted = format(zoned, fullDate ? DATE_TIME_FORMAT : DATE_FORMAT);
  return formatted;
};

export const zonedTime = (d: Date) => {
  const time = new TZDateMini(d, getUserTz());
  const str = format(time, TIME_FORMAT);
  return str;
}
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
