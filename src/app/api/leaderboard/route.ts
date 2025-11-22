import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'leaderboard.json');
const HISTORY_PATH = path.join(process.cwd(), 'data', 'leaderboard-history.json');

async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeData(data: any) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

async function appendHistory(snapshot: any) {
  try {
    const raw = await fs.readFile(HISTORY_PATH, 'utf8');
    const arr = JSON.parse(raw || '[]');
    arr.push(snapshot);
    await fs.writeFile(HISTORY_PATH, JSON.stringify(arr, null, 2), 'utf8');
  } catch (err) {
    // best-effort
    await fs.writeFile(HISTORY_PATH, JSON.stringify([snapshot], null, 2), 'utf8');
  }
}

function broadcastToSSE(data: any) {
  try {
    // global SSE controllers stored by stream route
    // @ts-ignore
    const controllers = globalThis.__leaderboard_sse_controllers as any[] | undefined;
    if (!controllers || controllers.length === 0) return;
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    const enc = new TextEncoder();
    for (const c of controllers) {
      try {
        c.enqueue(enc.encode(payload));
      } catch (e) {
        // ignore
      }
    }
  } catch (e) {
    // ignore
  }
}

export async function GET() {
  const data = await readData();
  // ensure sorted desc by score
  data.sort((a: any, b: any) => b.score - a.score);
  return new Response(JSON.stringify({ members: data }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: Request) {
  // Accept either: { updates: [{id, score}] } or { members: [...] }
  const body = await req.json().catch(() => ({}));
  const existing = await readData();

  let updated = existing;
  if (Array.isArray(body.members)) {
    updated = body.members;
  } else if (Array.isArray(body.updates)) {
    const map = new Map(existing.map((m: any) => [m.id, m]));
    for (const u of body.updates) {
      const item = map.get(u.id);
      if (item) item.score = u.score;
      else map.set(u.id, u);
    }
    updated = Array.from(map.values());
  } else if (body.id && typeof body.score === 'number') {
    // single update
    updated = existing.map((m: any) => (m.id === body.id ? { ...m, score: body.score } : m));
  }

  // sort and write
  updated.sort((a: any, b: any) => b.score - a.score);
  await writeData(updated);

  // append to history snapshot (with timestamp)
  await appendHistory({ at: new Date().toISOString(), snapshot: updated });

  // broadcast via SSE
  broadcastToSSE({ type: 'update', members: updated });

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
