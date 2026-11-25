// The arithmetic of the ledger: totals, rates and per-category standing. Every view asks here,
// so the same number is computed the same way on every page.

export function money(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function moneyExact(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function totalIncome(income) {
  return income.reduce((sum, row) => sum + row.amount, 0);
}

export function totalBudget(categories) {
  return categories.reduce((sum, c) => sum + c.budget, 0);
}

export function totalSpent(categories) {
  return categories.reduce((sum, c) => sum + c.spent, 0);
}

export function categoryState(c) {
  const pct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
  return { pct, over: c.spent > c.budget, left: c.budget - c.spent };
}

// The 50/30/20 rule of thumb, measured against take-home income.
export function ruleOfThumb(income, categories) {
  const needs = categories.filter((c) => c.kind === 'need').reduce((s, c) => s + c.spent, 0);
  const wants = categories.filter((c) => c.kind === 'want').reduce((s, c) => s + c.spent, 0);
  const saved = income - needs - wants;
  const share = (n) => Math.round((n / income) * 100);
  return {
    needs, wants, saved,
    needsPct: share(needs), wantsPct: share(wants), savedPct: share(saved),
    targets: { needs: 50, wants: 30, saved: 20 },
  };
}

export function goalProgress(goal) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const remaining = Math.max(0, goal.target - goal.saved);
  const months = goal.monthly > 0 ? Math.ceil(remaining / goal.monthly) : Infinity;
  return { pct, remaining, months };
}
