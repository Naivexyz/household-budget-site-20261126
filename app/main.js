// Hearth & Ledger's engine room: holds the ledger state, routes the five pages by the URL hash,
// and wires each page's controls. Editing a budget, adding a transaction or changing a goal
// contribution updates the one shared state, so every page agrees with every other.

import { HOUSEHOLD, CATEGORIES, TRANSACTIONS, GOALS } from './data.js';
import { money, totalIncome, totalBudget, categoryState, ruleOfThumb, goalProgress } from './ledger.js';
import { overviewView, budgetView, transactionsView, goalsView, insightsView } from './views.js';

const state = {
  income: HOUSEHOLD.income.map((row) => ({ ...row })),
  categories: CATEGORIES.map((c) => ({ ...c })),
  transactions: TRANSACTIONS.map((t) => ({ ...t })),
  goals: GOALS.map((g) => ({ ...g })),
};

const app = document.getElementById('app');

const VIEWS = {
  '': overviewView,
  budget: budgetView,
  transactions: transactionsView,
  goals: goalsView,
  insights: insightsView,
};

function route() {
  return location.hash.replace(/^#\/?/, '').split('?')[0];
}

function render() {
  const r = route();
  const view = VIEWS[r] ?? overviewView;
  app.innerHTML = view(state);
  document.querySelectorAll('.site-nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === (VIEWS[r] ? r : ''));
  });
  if (r === 'budget') wireBudget();
  if (r === 'transactions') wireTransactions();
  if (r === 'goals') wireGoals();
  window.scrollTo(0, 0);
}

/* ---------- budget page: editable limits ---------- */

function wireBudget() {
  app.querySelectorAll('[data-budget-for]').forEach((input) => {
    input.addEventListener('input', () => {
      const cat = state.categories.find((c) => c.id === input.dataset.budgetFor);
      const value = Math.max(0, Number(input.value) || 0);
      cat.budget = value;
      const s = categoryState(cat);
      const left = app.querySelector(`[data-left-for="${cat.id}"]`);
      const pill = app.querySelector(`[data-pill-for="${cat.id}"]`);
      if (left) left.textContent = s.over ? '−' + money(-s.left) : money(s.left);
      if (pill) {
        pill.textContent = s.over ? 'over' : s.pct + '%';
        pill.className = 'pill ' + (s.over ? 'over' : 'ok');
      }
      document.getElementById('plannedTotal').textContent = money(totalBudget(state.categories));
      document.getElementById('remainderTotal').textContent = money(totalIncome(state.income) - totalBudget(state.categories));
      const rule = ruleOfThumb(totalIncome(state.income), state.categories);
      const check = document.getElementById('ruleCheck');
      if (check) {
        check.querySelector('[data-rule="needs"]').textContent = rule.needsPct + '%';
        check.querySelector('[data-rule="wants"]').textContent = rule.wantsPct + '%';
        check.querySelector('[data-rule="saved"]').textContent = rule.savedPct + '%';
      }
    });
  });
}

/* ---------- transactions page: filter, search, add ---------- */

function wireTransactions() {
  const body = document.getElementById('txBody');
  const count = document.getElementById('txCount');
  const total = document.getElementById('txTotal');
  const catFilter = document.getElementById('filterCategory');
  const textFilter = document.getElementById('filterText');
  const catName = (id) => state.categories.find((c) => c.id === id)?.name ?? id;

  function draw() {
    const cat = catFilter.value;
    const text = textFilter.value.trim().toLowerCase();
    const rows = [...state.transactions]
      .sort((a, b) => a.date.localeCompare(b.date))
      .filter((t) => (!cat || t.category === cat) && (!text || t.payee.toLowerCase().includes(text)));
    body.innerHTML = rows.length
      ? rows.map((t) => `<tr><td>${t.date}</td><td>${t.payee}</td><td class="hide-phone">${catName(t.category)}</td><td class="num">$${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>`).join('')
      : '<tr><td colspan="4" class="empty-note">No transactions match — try a different filter.</td></tr>';
    count.textContent = `${rows.length} of ${state.transactions.length} transactions`;
    total.textContent = '$' + rows.reduce((s, t) => s + t.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  catFilter.addEventListener('change', draw);
  textFilter.addEventListener('input', draw);
  draw();

  document.getElementById('addForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const payee = document.getElementById('fPayee').value.trim();
    const amount = Number(document.getElementById('fAmount').value);
    const category = document.getElementById('fCategory').value;
    const date = document.getElementById('fDate').value || '2026-11-26';
    if (!payee || !(amount > 0)) return;
    state.transactions.push({ date, payee, category, amount });
    const cat = state.categories.find((c) => c.id === category);
    if (cat) cat.spent = Math.round((cat.spent + amount) * 100) / 100;
    document.getElementById('fPayee').value = '';
    document.getElementById('fAmount').value = '';
    draw();
  });
}

/* ---------- goals page: contribution calculator ---------- */

function wireGoals() {
  app.querySelectorAll('[data-monthly-for]').forEach((input) => {
    input.addEventListener('input', () => {
      const goal = state.goals.find((g) => g.id === input.dataset.monthlyFor);
      goal.monthly = Math.max(0, Number(input.value) || 0);
      const p = goalProgress(goal);
      const label = app.querySelector(`[data-months-for="${goal.id}"]`);
      if (label) label.textContent = p.months === Infinity ? 'never, at $0 a month' : p.remaining === 0 ? 'done' : `${p.months} months`;
    });
  });
}

window.addEventListener('hashchange', render);
render();
