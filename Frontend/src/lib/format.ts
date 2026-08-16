export function formatINR(amount: number, opts: { decimals?: boolean; symbol?: boolean } = {}): string {
  const { decimals = false, symbol = true } = opts;
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });
  return formatter.format(amount).replace('₹', symbol ? '₹' : '');
}

export function formatINRShort(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} Lac`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return formatINR(amount);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function maskAccount(num: string): string {
  if (num.length <= 4) return num;
  return 'XXXX' + num.slice(-4);
}

export function maskCard(num: string): string {
  const parts = num.split(' ');
  if (parts.length === 4) return `•••• •••• •••• ${parts[3]}`;
  return num;
}

export function initials(name: string): string {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export function classNames(...args: (string | false | undefined | null)[]): string {
  return args.filter(Boolean).join(' ');
}

export function computeFdMaturity(principal: number, annualRate: number, tenureMonths: number): {
  maturityAmount: number;
  interestEarned: number;
} {
  const r = annualRate / 100;
  const t = tenureMonths / 12;
  const interestEarned = Math.round(principal * r * t);
  return { maturityAmount: principal + interestEarned, interestEarned };
}

export function computeRdMaturity(monthly: number, annualRate: number, tenureMonths: number): {
  maturityAmount: number;
  interestEarned: number;
  totalDeposits: number;
} {
  const totalDeposits = monthly * tenureMonths;
  const r = annualRate / 100 / 4;
  const n = tenureMonths / 3;
  const interestEarned = Math.round(monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)) - totalDeposits);
  return { maturityAmount: totalDeposits + interestEarned, interestEarned, totalDeposits };
}

export function computeEmi(principal: number, annualRate: number, tenureMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return Math.round(principal / tenureMonths);
  return Math.round((principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1));
}
