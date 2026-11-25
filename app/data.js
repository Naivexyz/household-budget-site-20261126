// The Miller household ledger: income, category budgets, transactions, savings goals and a six-month
// trend. One fictional but internally consistent household, November 2026, all amounts in US dollars.
// Every page of the site reads from this one dataset, so an edit anywhere agrees everywhere.

export const HOUSEHOLD = {
  name: 'The Miller household',
  members: 'Alex, Jordan, and two kids (Mia, 9 and Theo, 6)',
  month: 'November 2026',
  income: [
    { source: 'Salary — Alex (teaching hospital, IT)', amount: 4850, day: '1st' },
    { source: 'Salary — Jordan (part-time, library)', amount: 1620, day: '15th' },
    { source: 'Freelance — Jordan (book design)', amount: 380, day: 'varies' },
  ],
};

// kind: 'need' or 'want', for the 50/30/20 check on the Budget page.
export const CATEGORIES = [
  { id: 'housing',   name: 'Housing & rent',   kind: 'need', budget: 1900, spent: 1875, note: 'Rent $1,750, renter\u2019s insurance $45, storage $80' },
  { id: 'groceries', name: 'Groceries',        kind: 'need', budget: 720,  spent: 684,  note: 'Weekly shop at Market Basket plus the farmers\u2019 market' },
  { id: 'utilities', name: 'Utilities & bills', kind: 'need', budget: 285, spent: 301,  note: 'Electric, gas, water, broadband and two phones' },
  { id: 'transport', name: 'Transport',        kind: 'need', budget: 340,  spent: 298,  note: 'Fuel, transit passes and parking' },
  { id: 'health',    name: 'Health',           kind: 'need', budget: 220,  spent: 164,  note: 'Pharmacy, dentist co-pays, gym for two' },
  { id: 'kids',      name: 'Kids & school',    kind: 'need', budget: 310,  spent: 288,  note: 'School meals, clubs, shoes that fit this month' },
  { id: 'dining',    name: 'Dining out',       kind: 'want', budget: 260,  spent: 312,  note: 'Two family dinners and Friday takeaway' },
  { id: 'fun',       name: 'Fun & streaming',  kind: 'want', budget: 150,  spent: 142,  note: 'Cinema, streaming, games and the book club' },
  { id: 'clothing',  name: 'Clothing',         kind: 'want', budget: 180,  spent: 96,   note: 'Winter boots for Theo, nothing else this month' },
  { id: 'personal',  name: 'Personal care',    kind: 'want', budget: 120,  spent: 88,   note: 'Haircuts and toiletries' },
  { id: 'pets',      name: 'Pets',             kind: 'want', budget: 90,   spent: 74,   note: 'Biscuit the cat: food, litter and one vet visit' },
  { id: 'misc',      name: 'Everything else',  kind: 'want', budget: 150,  spent: 133,  note: 'Gifts, household bits, the odd surprise' },
];

export const TRANSACTIONS = [
  { date: '2026-11-02', payee: 'Landlord — Maple St Properties', category: 'housing', amount: 1750 },
  { date: '2026-11-03', payee: 'Market Basket', category: 'groceries', amount: 148.20 },
  { date: '2026-11-04', payee: 'City Electric', category: 'utilities', amount: 96.40 },
  { date: '2026-11-05', payee: 'Shell — Route 9', category: 'transport', amount: 52.10 },
  { date: '2026-11-06', payee: 'Noodle House', category: 'dining', amount: 64.80 },
  { date: '2026-11-07', payee: 'Farmers\u2019 market', category: 'groceries', amount: 43.55 },
  { date: '2026-11-08', payee: 'CVS Pharmacy', category: 'health', amount: 38.25 },
  { date: '2026-11-09', payee: 'Metro Transit', category: 'transport', amount: 68.00 },
  { date: '2026-11-10', payee: 'Market Basket', category: 'groceries', amount: 161.30 },
  { date: '2026-11-11', payee: 'Broadband — NorthLink', category: 'utilities', amount: 59.99 },
  { date: '2026-11-12', payee: 'School lunch account', category: 'kids', amount: 85.00 },
  { date: '2026-11-13', payee: 'Pizza Pronto (takeaway)', category: 'dining', amount: 42.60 },
  { date: '2026-11-14', payee: 'Cinema City', category: 'fun', amount: 46.00 },
  { date: '2026-11-15', payee: 'Pet Barn', category: 'pets', amount: 51.20 },
  { date: '2026-11-16', payee: 'Market Basket', category: 'groceries', amount: 139.85 },
  { date: '2026-11-17', payee: 'Water Authority', category: 'utilities', amount: 47.30 },
  { date: '2026-11-18', payee: 'Shoe repair & boots', category: 'clothing', amount: 96.00 },
  { date: '2026-11-19', payee: 'Dentist — co-pay', category: 'health', amount: 60.00 },
  { date: '2026-11-20', payee: 'Trattoria Lupo (family dinner)', category: 'dining', amount: 118.40 },
  { date: '2026-11-21', payee: 'After-school robotics club', category: 'kids', amount: 120.00 },
  { date: '2026-11-22', payee: 'Market Basket', category: 'groceries', amount: 152.60 },
  { date: '2026-11-23', payee: 'Streaming bundle', category: 'fun', amount: 27.99 },
  { date: '2026-11-24', payee: 'Gas — home heating', category: 'utilities', amount: 97.31 },
  { date: '2026-11-25', payee: 'Gift shop — Gran\u2019s birthday', category: 'misc', amount: 58.00 },
];

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', target: 12000, saved: 8400, monthly: 350, note: 'Three months of core bills, kept in a separate savings account. The rule: touch it only for a real emergency, then rebuild it first.' },
  { id: 'kyoto', name: 'Kyoto trip, spring 2027', target: 3200, saved: 1850, monthly: 200, note: 'Flights for four plus a week in a machiya townhouse. Booked nothing yet — the fund decides the dates.' },
  { id: 'car', name: 'Next car deposit', target: 6000, saved: 2300, monthly: 250, note: 'The current car is 11 years old. A deposit this size keeps the loan small enough to clear in three years.' },
];

// Six months of the household's actuals, June to November 2026.
export const TREND = [
  { month: 'Jun', income: 6720, spent: 4980 },
  { month: 'Jul', income: 6850, spent: 4720 },
  { month: 'Aug', income: 6790, spent: 5210 },
  { month: 'Sep', income: 6920, spent: 4690 },
  { month: 'Oct', income: 6850, spent: 4815 },
  { month: 'Nov', income: 6850, spent: 4455 },
];

export const TIPS = [
  { title: 'Dining out is $52 over plan', body: 'Two family dinners and the Friday takeaway added up. The Millers\u2019 fix for December: one dinner out, and takeaway moves to every second Friday — worth about $90 a month.' },
  { title: 'The grocery run is a quiet win', body: 'Four Market Basket trips and one market visit came to $684 against a $720 budget. A written list and a no-top-up-shop rule did it; the midweek \u201cjust milk\u201d trip used to add $60 a month.' },
  { title: 'August is the expensive month', body: 'Spending peaked at $5,210 in August — holidays and school-start costs. The plan now puts $120 a month into an \u201cAugust fund\u201d from January, so the peak stops being a surprise.' },
  { title: 'Savings rate: 35% this month', body: 'Of $6,850 coming in, $2,395 was still unspent on the 25th; $800 of it goes to the three goals on payday and the rest builds the current-account buffer. Paying savings first — before the month can spend it — is the single habit behind every other number on this page.' },
];
