// The five pages of the site, each a function from the ledger state to an HTML string.
// main.js owns the state and wires the controls these pages declare.

import { HOUSEHOLD, TREND, TIPS } from './data.js';
import { money, moneyExact, totalIncome, totalBudget, totalSpent, categoryState, ruleOfThumb, goalProgress } from './ledger.js';
import { trendChart, donutChart, donutLegend } from './charts.js';

function barRow(c) {
  const s = categoryState(c);
  const width = Math.min(100, s.pct);
  return `<div class="bar-row">
    <div class="bar-head"><span>${c.name} ${s.over ? '<span class="pill over">over</span>' : ''}</span>
    <span class="amounts"><strong>${money(c.spent)}</strong> of ${money(c.budget)}</span></div>
    <div class="bar"><span class="${s.over ? 'over' : ''}" style="width:${width}%"></span></div>
    <p class="bar-note">${s.over ? `${money(-s.left)} over plan` : `${money(s.left)} left`} · ${c.note}</p>
  </div>`;
}

export function overviewView(state) {
  const income = totalIncome(state.income);
  const spent = totalSpent(state.categories);
  const budgeted = totalBudget(state.categories);
  const saved = income - spent;
  const rate = Math.round((saved / income) * 100);
  const top = [...state.categories].sort((a, b) => b.spent - a.spent).slice(0, 5);
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const catName = (id) => state.categories.find((c) => c.id === id)?.name ?? id;
  return `
  <div class="lede">
    <p class="kicker">${HOUSEHOLD.month} · ${HOUSEHOLD.members}</p>
    <h1>The month, in one look</h1>
    <p>The Millers take home ${money(income)} a month. By 25 November they had spent ${money(spent)} of a
    ${money(budgeted)} plan and kept ${money(saved)} unspent — a ${rate}% savings rate. Two categories
    ran over; everything else held. The pages behind the links above run the same ledger.</p>
  </div>
  <div class="cards">
    <div class="card"><p class="label">Take-home income</p><p class="figure">${money(income)}</p><p class="sub">Three sources, listed on the <a href="#/budget">budget plan</a></p></div>
    <div class="card"><p class="label">Spent so far</p><p class="figure">${money(spent)}</p><p class="sub">of ${money(budgeted)} planned · <strong>${money(budgeted - spent)} left</strong></p></div>
    <div class="card"><p class="label">Saved this month</p><p class="figure">${money(saved)}</p><p class="sub"><strong>${rate}%</strong> of income · goals are paid first, on payday</p></div>
    <div class="card"><p class="label">Categories over plan</p><p class="figure">${state.categories.filter((c) => c.spent > c.budget).length} of ${state.categories.length}</p><p class="sub">Dining out and utilities — see <a href="#/insights">insights</a></p></div>
  </div>

  <div class="card pace">
    <div class="bar-head"><span><strong>Spending pace</strong> — day 25 of 30</span><span class="amounts">${money(spent)} of ${money(budgeted)} spent (${Math.round((spent / budgeted) * 100)}%) with ${Math.round((25 / 30) * 100)}% of the month gone</span></div>
    <div class="bar" style="margin-top:1.2rem"><span style="width:${Math.round((spent / budgeted) * 100)}%"></span><span class="pace-marker" style="left:${Math.round((25 / 30) * 100)}%"></span></div>
    <p class="bar-note">Spending runs a little ahead of the calendar — almost all of it the two over-plan categories. With five days left and ${money(budgeted - spent)} of plan remaining, the month still lands inside the plan if the last week is ordinary.</p>
  </div>

  <h2 class="section">Where the money is going</h2>
  <div class="card">${top.map(barRow).join('')}</div>

  <div class="split" style="margin-top:0.9rem">
    <div class="card chart-card">
      <h3>Income vs spending, June to November</h3>
      <p class="chart-sub">Spending dipped in November after the August peak — the story is on the insights page.</p>
      ${trendChart(TREND)}
      <div class="legend"><span><span class="swatch" style="background:#3e7d4e"></span>Income</span><span><span class="swatch" style="background:#b4552d"></span>Spending</span></div>
    </div>
    <div class="card">
      <h3 class="serif" style="margin-top:0">Savings goals</h3>
      ${state.goals.map((g) => { const p = goalProgress(g); return `<div class="bar-row"><div class="bar-head"><span>${g.name}</span><span class="amounts"><strong>${money(g.saved)}</strong> of ${money(g.target)}</span></div><div class="bar"><span style="width:${p.pct}%"></span></div><p class="bar-note">${p.pct}% there · ${money(g.monthly)} a month · about ${p.months} months to go</p></div>`; }).join('')}
      <p><a href="#/goals">Open the goals page →</a></p>
    </div>
  </div>

  <h2 class="section">Latest transactions</h2>
  <table class="ledger">
    <thead><tr><th>Date</th><th>Payee</th><th class="hide-phone">Category</th><th class="num">Amount</th></tr></thead>
    <tbody>${recent.map((t) => `<tr><td>${t.date.slice(5)}</td><td>${t.payee}</td><td class="hide-phone">${catName(t.category)}</td><td class="num">${moneyExact(t.amount)}</td></tr>`).join('')}</tbody>
  </table>
  <p><a href="#/transactions">All ${state.transactions.length} transactions, with filters and a form to add one →</a></p>`;
}

export function budgetView(state) {
  const income = totalIncome(state.income);
  const rule = ruleOfThumb(income, state.categories);
  const rows = state.categories.map((c) => {
    const s = categoryState(c);
    return `<tr>
      <td><strong>${c.name}</strong><br><span style="color:var(--ink-soft);font-size:0.85rem">${c.kind === 'need' ? 'Need' : 'Want'} · ${c.note}</span></td>
      <td class="num"><input class="budget-edit" type="number" min="0" step="10" value="${c.budget}" data-budget-for="${c.id}" aria-label="Monthly budget for ${c.name}"></td>
      <td class="num">${money(c.spent)}</td>
      <td class="num" data-left-for="${c.id}">${s.over ? '−' + money(-s.left) : money(s.left)}</td>
      <td><span class="pill ${s.over ? 'over' : 'ok'}" data-pill-for="${c.id}">${s.over ? 'over' : s.pct + '%'}</span></td>
    </tr>`;
  }).join('');
  return `
  <div class="lede">
    <p class="kicker">Budget plan</p>
    <h1>The plan for ${HOUSEHOLD.month}</h1>
    <p>Every category has a monthly limit the household agreed in advance. The budget column is editable —
    change a figure and the totals and the 50/30/20 check below update at once. Spending is the month to date.</p>
  </div>
  <div class="cards" style="margin-bottom:1rem">
    <div class="card"><p class="label">Income</p><p class="figure">${money(income)}</p><p class="sub">${state.income.map((i) => `${i.source}: <strong>${money(i.amount)}</strong> (paid ${i.day})`).join('<br>')}</p></div>
    <div class="card"><p class="label">Planned spending</p><p class="figure" id="plannedTotal">${money(totalBudget(state.categories))}</p><p class="sub">Across ${state.categories.length} categories</p></div>
    <div class="card"><p class="label">Unplanned remainder</p><p class="figure" id="remainderTotal">${money(income - totalBudget(state.categories))}</p><p class="sub">Income the plan does not spend — the savings buffer</p></div>
  </div>
  <table class="ledger">
    <thead><tr><th>Category</th><th class="num">Budget / month</th><th class="num">Spent</th><th class="num">Left</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <h2 class="section">The 50/30/20 check</h2>
  <div class="card">
    <p style="margin-top:0">A common rule of thumb: about <strong>50%</strong> of take-home pay on needs, <strong>30%</strong> on
    wants, <strong>20%</strong> to savings. Against this month's actual spending of ${money(totalSpent(state.categories))}:</p>
    <div id="ruleCheck">
      <div class="bar-row"><div class="bar-head"><span>Needs — target ${rule.targets.needs}%</span><span class="amounts"><strong data-rule="needs">${rule.needsPct}%</strong> · ${money(rule.needs)}</span></div><div class="bar"><span style="width:${Math.min(100, rule.needsPct * 2)}%"></span></div></div>
      <div class="bar-row"><div class="bar-head"><span>Wants — target ${rule.targets.wants}%</span><span class="amounts"><strong data-rule="wants">${rule.wantsPct}%</strong> · ${money(rule.wants)}</span></div><div class="bar"><span style="width:${Math.min(100, rule.wantsPct * 2)}%;background:var(--gold)"></span></div></div>
      <div class="bar-row"><div class="bar-head"><span>Savings — target ${rule.targets.saved}%</span><span class="amounts"><strong data-rule="saved">${rule.savedPct}%</strong> · ${money(rule.saved)}</span></div><div class="bar"><span style="width:${Math.min(100, rule.savedPct * 2)}%;background:var(--accent)"></span></div></div>
    </div>
    <p class="bar-note">Needs run a little hot because rent in this neighbourhood is what it is; the household answers by keeping wants under target instead of pretending the rent is lower.</p>
  </div>`;
}

export function transactionsView(state) {
  const options = state.categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
  return `
  <div class="lede">
    <p class="kicker">Transactions</p>
    <h1>Every payment in ${HOUSEHOLD.month}</h1>
    <p>Filter by category or search a payee. Adding a transaction with the form puts it in the list,
    adds it to that category's spending, and every other page agrees — try it, then check the overview.</p>
  </div>
  <form class="card controls" id="addForm" style="align-items:end">
    <div class="field"><label for="fDate">Date</label><input id="fDate" type="date" value="2026-11-26" required></div>
    <div class="field" style="flex:1;min-width:180px"><label for="fPayee">Payee</label><input id="fPayee" type="text" placeholder="e.g. Market Basket" required></div>
    <div class="field"><label for="fCategory">Category</label><select id="fCategory">${options}</select></div>
    <div class="field"><label for="fAmount">Amount ($)</label><input id="fAmount" type="number" min="0.01" step="0.01" placeholder="0.00" required style="width:7rem"></div>
    <button class="btn" type="submit">Add transaction</button>
  </form>
  <div class="controls">
    <div class="field"><label for="filterCategory">Category</label><select id="filterCategory"><option value="">All categories</option>${options}</select></div>
    <div class="field" style="flex:1;min-width:200px"><label for="filterText">Search payee</label><input id="filterText" type="search" placeholder="Type to filter…"></div>
  </div>
  <table class="ledger">
    <thead><tr><th>Date</th><th>Payee</th><th class="hide-phone">Category</th><th class="num">Amount</th></tr></thead>
    <tbody id="txBody"></tbody>
    <tfoot><tr><td colspan="3" id="txCount"></td><td class="num" id="txTotal"></td></tr></tfoot>
  </table>`;
}

export function goalsView(state) {
  return `
  <div class="lede">
    <p class="kicker">Savings goals</p>
    <h1>What the savings are for</h1>
    <p>Three goals, paid on payday before the month can spend the money. Change a monthly contribution
    and the time-to-goal updates — that is the whole calculator.</p>
  </div>
  ${state.goals.map((g) => { const p = goalProgress(g); return `
  <div class="card goal">
    <div class="bar-head"><h3 class="serif" style="margin:0">${g.name}</h3><span class="amounts"><strong>${money(g.saved)}</strong> of ${money(g.target)} · ${p.pct}%</span></div>
    <div class="bar"><span style="width:${p.pct}%"></span></div>
    <p style="color:var(--ink-soft);margin:0.5rem 0">${g.note}</p>
    <div class="goal-meta">
      <span>Still to save: <strong>${money(p.remaining)}</strong></span>
      <span>Monthly contribution: $<input type="number" min="0" step="10" value="${g.monthly}" data-monthly-for="${g.id}" aria-label="Monthly contribution for ${g.name}"></span>
      <span>At that rate: <strong data-months-for="${g.id}">${p.months} months</strong></span>
    </div>
  </div>`; }).join('')}
  <div class="card">
    <h3 class="serif" style="margin-top:0">The order matters</h3>
    <p style="margin-bottom:0">If money gets tight, the emergency fund is filled first, the car second, the trip last —
    a holiday can move, a boiler cannot. When a goal finishes, its contribution rolls into the next one,
    which is how the car fund is growing faster than its $250 a month suggests it should.</p>
  </div>`;
}

export function insightsView(state) {
  const entries = [...state.categories].sort((a, b) => b.spent - a.spent).map((c) => ({ name: c.name, value: c.spent }));
  const over = state.categories.filter((c) => c.spent > c.budget);
  return `
  <div class="lede">
    <p class="kicker">Insights</p>
    <h1>What November taught the ledger</h1>
    <p>Spending of ${money(totalSpent(state.categories))} against income of ${money(totalIncome(state.income))} — the best
    month since June. ${over.length} categories ran over: ${over.map((c) => `${c.name.toLowerCase()} by ${money(c.spent - c.budget)}`).join(' and ')}.</p>
  </div>
  <div class="split">
    <div class="card chart-card">
      <h3>Where the money went</h3>
      <p class="chart-sub">Share of November spending by category. Housing is nearly half of everything — normal for this city, and why the small categories decide the savings rate.</p>
      ${donutChart(entries)}
    </div>
    <div class="card">
      <h3 class="serif" style="margin-top:0">The shares</h3>
      ${donutLegend(entries)}
    </div>
  </div>
  <h2 class="section">Four things worth knowing</h2>
  <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
    ${TIPS.map((t) => `<div class="card tip"><h3>${t.title}</h3><p>${t.body}</p></div>`).join('')}
  </div>
  <h2 class="section">The six-month picture</h2>
  <div class="card chart-card">
    ${trendChart(TREND)}
    <div class="legend"><span><span class="swatch" style="background:#3e7d4e"></span>Income</span><span><span class="swatch" style="background:#b4552d"></span>Spending</span></div>
    <p class="chart-sub" style="margin-top:0.6rem">Income is flat by design — two salaries and a little freelance work. Everything interesting happens in the terracotta bars: an August peak, then four months of the plan working.</p>
  </div>`;
}
