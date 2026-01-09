import { ROLE_RANK, Roles } from '@my-ledger/api/role';

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

export const hasPermission = (curPermission: Roles, requiredPermission: Roles) => {
  const rank = ROLE_RANK[curPermission];
  const requireRank = ROLE_RANK[requiredPermission];
  return rank >= requireRank;
};
