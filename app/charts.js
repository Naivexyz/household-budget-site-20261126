// Small hand-drawn SVG charts, built as strings: grouped bars for the six-month trend and a
// donut for where the money went. No library — the charts are a few dozen lines and load instantly.

const INK = '#26332b';
const SOFT = '#5a6a5e';
const GREEN = '#3e7d4e';
const TERRA = '#b4552d';
const GOLD = '#c9932b';
const GRID = '#e3d9c3';

export function trendChart(trend, width = 640, height = 300) {
  const max = Math.max(...trend.map((t) => Math.max(t.income, t.spent))) * 1.12;
  const padL = 44, padB = 26, padT = 12;
  const plotW = width - padL - 8, plotH = height - padB - padT;
  const groupW = plotW / trend.length;
  const barW = Math.min(26, groupW / 3.4);
  const y = (v) => padT + plotH - (v / max) * plotH;
  let out = `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Income and spending by month">`;
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i, yy = y(v);
    out += `<line x1="${padL}" y1="${yy}" x2="${width - 8}" y2="${yy}" stroke="${GRID}" stroke-width="1"/>`;
    out += `<text x="${padL - 6}" y="${yy + 4}" text-anchor="end" font-size="11" fill="${SOFT}">$${Math.round(v / 100) / 10}k</text>`;
  }
  trend.forEach((t, i) => {
    const cx = padL + groupW * i + groupW / 2;
    out += `<rect x="${cx - barW - 3}" y="${y(t.income)}" width="${barW}" height="${padT + plotH - y(t.income)}" rx="3" fill="${GREEN}"/>`;
    out += `<rect x="${cx + 3}" y="${y(t.spent)}" width="${barW}" height="${padT + plotH - y(t.spent)}" rx="3" fill="${TERRA}"/>`;
    out += `<text x="${cx}" y="${height - 8}" text-anchor="middle" font-size="12" fill="${INK}">${t.month}</text>`;
  });
  return out + '</svg>';
}

const DONUT_COLORS = ['#b4552d', '#3e7d4e', '#c9932b', '#5b7d99', '#8a6ea8', '#c25e7e', '#6d9e8f', '#a8854f', '#7a7263', '#4f6f8f', '#9c5b3f', '#87986a'];

export function donutChart(entries, size = 300) {
  const total = entries.reduce((s, e) => s + e.value, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - 8, inner = r * 0.58;
  let angle = -Math.PI / 2;
  let out = `<svg class="chart" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category" style="max-width:${size}px;margin:0 auto">`;
  entries.forEach((e, i) => {
    const sweep = (e.value / total) * Math.PI * 2;
    const a0 = angle, a1 = angle + sweep;
    angle = a1;
    const large = sweep > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    out += `<path d="M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi0} ${yi0} Z" fill="${DONUT_COLORS[i % DONUT_COLORS.length]}" stroke="#faf5ec" stroke-width="2"><title>${e.name}: ${Math.round((e.value / total) * 100)}%</title></path>`;
  });
  out += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" fill="${SOFT}">spent in Nov</text>`;
  out += `<text x="${cx}" y="${cy + 22}" text-anchor="middle" font-size="24" font-weight="700" fill="${INK}">$${total.toLocaleString('en-US')}</text>`;
  return out + '</svg>';
}

export function donutLegend(entries) {
  const total = entries.reduce((s, e) => s + e.value, 0);
  return entries
    .map((e, i) => `<div class="legend-row"><span class="swatch" style="background:${DONUT_COLORS[i % DONUT_COLORS.length]}"></span>${e.name}<span class="legend-pct">${Math.round((e.value / total) * 100)}%</span></div>`)
    .join('');
}
