const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function fmtDate(str) {
  if (!str) return '';
  const [y, m] = str.split('-');
  const month = MONTHS[parseInt(m, 10) - 1];
  return month ? `${month} ${y}` : y;
}

export function dateRange(start, end, current) {
  const s = fmtDate(start);
  const e = current ? 'Present' : fmtDate(end);
  if (s && e) return `${s} – ${e}`;
  return s || e || '';
}
