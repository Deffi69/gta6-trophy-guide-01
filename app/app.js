// Leonida Legend — GTA VI trophy guide & tracker.
// Static, offline: the only fetch is local data/trophies.json. Progress lives in
// localStorage and can be exported to / imported from a JSON file.
const KEY = 'gta6-trophy-guide-progress-v1';

const STAGES = [
  { n: 1, title: 'Play the story — Chapters 1–4 and the finale', text: 'Story trophies pop as you play. Keep a manual save at the start of every chapter and one before the final mission: there is no mission replay.' },
  { n: 2, title: 'Stranger missions & side finales', text: 'Andy, Billy, Kenton, Randy and Tyrone each have a final mission — plus 8 stranger strands for Strangers & Freaks and Bret’s hunting questline. All stay open after the credits.' },
  { n: 3, title: 'Activities & skills', text: 'Shooting range golds, drone races, 20 race wins, fishing, arcade games, 250 stunts, 50 challenges, and max Strength for both characters.' },
  { n: 4, title: 'Robberies & the underworld', text: 'Shops, jewelry stores, armored trucks, bank vaults, gang operations and laundering marked bills. Bring your partner: several trophies need them beside you.' },
  { n: 5, title: 'Explore, collect & clean up', text: 'All of Leonida, 100 vehicles, 100 WAiNK spots, card sets, garages, meditation spots — and finally A Long Road, 100% completion, then the Platinum.' },
];

const KIND_LABELS = {
  story: 'Story', side: 'Stranger missions', activity: 'Activities', collectible: 'Collectibles',
  robbery: 'Robberies', exploration: 'Exploration', combat: 'Combat', completion: 'Completion',
};

const params = new URLSearchParams(location.search);
const demo = params.get('demo') === '1';

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = new Set();
try { earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { earned = new Set(); }
// ?demo=1 previews the tracker with a few trophies ticked (in memory only, never saved).
if (demo) {
  for (const id of [2, 3, 4, 8, 15, 16, 19, 21, 32, 35, 53]) earned.add(trophies.find((t) => t.id === id).name);
}

const $ = (id) => document.getElementById(id);
const listEl = $('list'), emptyEl = $('empty'), showingEl = $('showing');
const searchEl = $('search'), kindEl = $('kind'), gradeEl = $('grade'), statusEl = $('status'), spoilerEl = $('spoilers');

// URL params drive the canned views (used by the screenshots in shots.json).
if (params.get('grade')) gradeEl.value = params.get('grade');
if (params.get('kind')) kindEl.value = params.get('kind');
if (params.get('spoiler') === 'off') spoilerEl.checked = false;
let stageFilter = null;

function save() {
  if (demo) return; // demo ticks are a preview only; real progress is the user's own.
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function gradeCount(g) { return trophies.filter((t) => t.grade === g).length; }
function earnedCount(g) { return trophies.filter((t) => t.grade === g && earned.has(t.name)).length; }

function renderProgress() {
  const total = trophies.length;
  const pct = Math.round((earned.size / total) * 100);
  $('progressText').textContent = `${earned.size} of ${total} earned`;
  $('progressPct').textContent = `${pct}% to the Platinum`;
  $('progressFill').style.width = `${pct}%`;
  $('gradeCounts').innerHTML = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `<span>${g[0].toUpperCase() + g.slice(1)} ${earnedCount(g)}/${gradeCount(g)}</span>`).join('');
}

function renderStages() {
  const ol = $('stages');
  ol.replaceChildren();
  for (const s of STAGES) {
    const inStage = trophies.filter((t) => t.roadmap_stage === s.n);
    const got = inStage.filter((t) => earned.has(t.name)).length;
    const li = document.createElement('li');
    li.tabIndex = 0;
    li.classList.toggle('active', stageFilter === s.n);
    li.setAttribute('role', 'button');
    li.setAttribute('aria-pressed', String(stageFilter === s.n));
    li.title = 'Click to filter the list to this stage';
    const num = document.createElement('span');
    num.className = 'stage-num' + (got === inStage.length ? ' done' : '');
    num.textContent = got === inStage.length ? '✓' : s.n;
    const body = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = `Stage ${s.n} — ${s.title}`;
    const p = document.createElement('p');
    p.textContent = s.text;
    body.append(h, p);
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = `${got}/${inStage.length} earned`;
    li.append(num, body, count);
    const toggle = () => { stageFilter = stageFilter === s.n ? null : s.n; render(); };
    li.addEventListener('click', toggle);
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    ol.append(li);
  }
}

function spoilerHidden(t) {
  return spoilerEl.checked && t.story && !earned.has(t.name);
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kindEl.value === 'missable' && !t.missable) return false;
    if (kindEl.value === 'online') return false; // the game lists no online trophies
    if (kindEl.value !== 'all' && kindEl.value !== 'missable' && t.kind !== kindEl.value) return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (statusEl.value === 'earned' && !earned.has(t.name)) return false;
    if (statusEl.value === 'remaining' && earned.has(t.name)) return false;
    if (stageFilter && t.roadmap_stage !== stageFilter) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide} ${KIND_LABELS[t.kind] ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function render() {
  renderProgress();
  renderStages();
  const shown = visibleTrophies();
  listEl.replaceChildren();
  for (const t of shown) {
    const card = document.createElement('article');
    card.className = 'card' + (earned.has(t.name) ? ' earned' : '') + (t.missable ? ' missable-card' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name); else earned.delete(t.name);
      save();
      render();
    });
    const body = document.createElement('div');
    const head = document.createElement('div');
    head.className = 'card-head';
    const h = document.createElement('h3');
    const hidden = spoilerHidden(t);
    h.textContent = hidden ? 'Hidden story trophy' : t.name;
    const badge = document.createElement('span');
    badge.className = `badge ${t.grade}`;
    badge.textContent = t.grade;
    head.append(h, badge);
    if (t.missable) { const tag = document.createElement('span'); tag.className = 'tag missable'; tag.textContent = '⚠ Missable'; head.append(tag); }
    if (t.hidden) { const tag = document.createElement('span'); tag.className = 'tag hidden-tag'; tag.textContent = 'Hidden on PS5'; head.append(tag); }
    if (t.story) { const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = 'Story'; head.append(tag); }
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = `${KIND_LABELS[t.kind] ?? t.kind} · Stage ${t.roadmap_stage}`;
    head.append(kindTag);
    body.append(head);

    if (hidden) {
      const note = document.createElement('p');
      note.className = 'spoiler-note';
      note.textContent = 'Story trophy — its name and description stay hidden until you earn it (or switch “Hide story spoilers” off).';
      body.append(note);
    } else {
      const off = document.createElement('p');
      off.className = 'official';
      off.textContent = `“${t.description}”`;
      const guide = document.createElement('p');
      guide.className = 'guide';
      const label = document.createElement('span');
      label.className = 'guide-label';
      label.textContent = 'How to get it — ';
      guide.append(label, document.createTextNode(t.guide));
      const src = document.createElement('p');
      src.className = 'source';
      src.textContent = 'Source: ';
      const a = document.createElement('a');
      a.href = t.source_url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = t.source;
      src.append(a);
      body.append(off, guide, src);
    }
    card.append(box, body);
    listEl.append(card);
  }
  emptyEl.hidden = shown.length !== 0;
  if (shown.length === 0) {
    $('emptyNote').textContent = kindEl.value === 'online'
      ? 'GTA VI lists no online trophies — all 55 are single-player and offline.'
      : 'Try clearing a filter.';
  }
  showingEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies${stageFilter ? ` · roadmap stage ${stageFilter}` : ''} · ${earned.size} earned`;
}

$('export').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned] };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    const valid = new Set(trophies.map((t) => t.name));
    earned = new Set((names ?? []).filter((n) => valid.has(n)));
    save();
    render();
  } catch {
    alert('That file could not be read as trophy progress. Export a progress file from this page and import that one.');
  }
  e.target.value = '';
});
$('reset').addEventListener('click', () => {
  if (!earned.size) return;
  if (confirm('Clear all earned ticks? You can export first to keep a backup.')) {
    earned = new Set();
    save();
    render();
  }
});
for (const el of [searchEl, kindEl, gradeEl, statusEl, spoilerEl]) {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
}

// Sources footer.
const srcList = $('sourceList');
for (const s of doc.sources) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
  a.textContent = s.name;
  li.append(a);
  srcList.append(li);
}
const notes = document.createElement('p');
notes.className = 'fineprint';
notes.textContent = doc.notes.join(' ');
srcList.after(notes);

render();
if (params.get('view') === 'roadmap') {
  document.getElementById('roadmap').scrollIntoView();
}
