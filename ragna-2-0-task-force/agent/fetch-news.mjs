// AMR news agent: collects headlines from public RSS feeds, tags them and writes news.json
import { writeFileSync } from 'node:fs';
const FEEDS = [
  { name: 'Google News: antimicrobial resistance', url: 'https://news.google.com/rss/search?q=%22antimicrobial+resistance%22+when:14d&hl=en&gl=US&ceid=US:en' },
  { name: 'Google News: AMR regulators', url: 'https://news.google.com/rss/search?q=antibiotic+(regulator+OR+labelling+OR+labeling+OR+EMA+OR+FDA+OR+WHO)+resistance+when:14d&hl=en&gl=US&ceid=US:en' },
  { name: 'WHO news', url: 'https://www.who.int/rss-feeds/news-english.xml', filter: true }
];
const KEY = /antimicrobial|antibiotic|\bAMR\b|resistan|superbug|stewardship/i;
const TAGS = [['Regulation', /regulat|agency|EMA|FDA|MHRA|approval|authori[sz]/i], ['Labelling', /label|packag|leaflet/i], ['One Health', /one health|animal|veterinar|livestock|environment/i], ['R&D', /develop|trial|novel|pipeline|phage|vaccine|diagnost/i], ['Surveillance', /surveillance|data|report|GLASS/i], ['Policy', /UN |United Nations|policy|action plan|summit/i]];
const dec = s => s.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/<[^>]+>/g, '').trim();
const pick = (x, t) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? dec(m[1]) : ''; };
const items = [];
for (const f of FEEDS) {
  try {
    const r = await fetch(f.url, { headers: { 'user-agent': 'ragna-news-agent/1.0' } });
    const xml = await r.text();
    for (const it of xml.split(/<item[\s>]/).slice(1)) {
      let title = pick(it, 'title'), link = pick(it, 'link'), date = pick(it, 'pubDate'), source = pick(it, 'source') || f.name.replace('Google News: ', '');
      if (!title || !link) continue;
      if (f.filter && !KEY.test(title + ' ' + pick(it, 'description'))) continue;
      if (source && title.endsWith(' - ' + source)) title = title.slice(0, -(source.length + 3));
      items.push({ title, link, source, date: date ? new Date(date).toISOString() : null, tags: TAGS.filter(([, re]) => re.test(title)).map(([t]) => t) });
    }
  } catch (e) { console.error('feed failed', f.url, e.message); }
}
const seen = new Set();
const uniq = items.filter(i => { const k = i.title.toLowerCase().slice(0, 70); if (seen.has(k)) return false; seen.add(k); return true; })
  .sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 30);
const count = t => uniq.filter(i => i.tags.includes(t)).length;
const top = TAGS.map(([t]) => [t, count(t)]).filter(([, n]) => n).sort((a, b) => b[1] - a[1]).slice(0, 3);
const digest = uniq.length ? `${uniq.length} AMR headlines in the last two weeks` + (top.length ? `; most about ${top.map(([t, n]) => `${t.toLowerCase()} (${n})`).join(', ')}.` : '.') : '';
writeFileSync(process.argv[2] || 'news.json', JSON.stringify({ updated: new Date().toISOString(), digest, items: uniq }, null, 1));
console.log('wrote', uniq.length, 'items');
