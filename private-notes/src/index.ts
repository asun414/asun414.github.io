interface D1Result<T> { results?: T[]; success: boolean }
interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T>(): Promise<D1Result<T>>;
  first<T>(): Promise<T | null>;
  run(): Promise<D1Result<unknown>>;
}
interface D1Database { prepare(query: string): D1Statement }
interface Env { DB: D1Database }

type Note = { id: string; title: string; body: string; author_email: string; created_at: string; updated_at: string };

const securityHeaders = {
  'Cache-Control': 'no-store, private',
  'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { ...securityHeaders, 'Content-Type': 'application/json; charset=utf-8' },
});

const html = (content: string, status = 200) => new Response(content, {
  status,
  headers: { ...securityHeaders, 'Content-Type': 'text/html; charset=utf-8' },
});

function authenticatedEmail(request: Request): string | null {
  return request.headers.get('Cf-Access-Authenticated-User-Email');
}

function validMutationOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  return Boolean(origin && origin === new URL(request.url).origin);
}

async function readPayload(request: Request): Promise<{ title: string; body: string } | null> {
  try {
    const value = await request.json() as { title?: unknown; body?: unknown };
    if (typeof value.title !== 'string' || typeof value.body !== 'string') return null;
    const title = value.title.trim();
    if (!title || title.length > 200 || value.body.length > 200_000) return null;
    return { title, body: value.body };
  } catch {
    return null;
  }
}

const app = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Private Notes · H. L. Sun</title>
<style>
:root{--paper:#f3efe6;--deep:#e8e0d2;--ink:#20231f;--soft:#62665e;--forest:#24483b;--red:#a84a32;--line:rgba(32,35,31,.18)}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.6 Georgia,"Times New Roman",serif}button,input,textarea{font:inherit;color:inherit}button{min-height:44px;padding:.5rem .9rem;border:1px solid var(--forest);background:transparent;cursor:pointer}button.primary{background:var(--forest);color:var(--paper)}button.danger{border-color:var(--red);color:var(--red)}header{border-bottom:1px solid var(--line)}header div,main{width:min(1120px,calc(100% - 32px));margin:auto}header div{min-height:68px;display:flex;align-items:center;justify-content:space-between}.brand{font-weight:bold}.muted,.meta{color:var(--soft)}main{padding:3rem 0 5rem}.intro{max-width:70ch;margin-bottom:2rem}.workspace{display:grid;grid-template-columns:minmax(240px,.7fr) minmax(0,1.8fr);border:1px solid var(--line);background:var(--line);gap:1px}.sidebar,.editor{background:var(--paper);padding:1.5rem}.sidebar{background:var(--deep)}.toolbar{display:flex;gap:.6rem;justify-content:space-between;align-items:center;margin-bottom:1rem}.note-list{list-style:none;padding:0;margin:0}.note-list button{width:100%;height:auto;text-align:left;border:0;border-top:1px solid var(--line);padding:.8rem 0}.note-list button[aria-current=true]{color:var(--red)}label{display:block;font-weight:bold;margin:.8rem 0 .35rem}input,textarea{width:100%;border:1px solid var(--line);background:var(--paper);padding:.75rem}textarea{min-height:48vh;resize:vertical;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.94rem}.actions{display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1rem}.status{min-height:1.5em;margin-top:1rem;color:var(--soft)}@media(max-width:760px){.workspace{grid-template-columns:1fr}.sidebar{max-height:42vh;overflow:auto}}
</style></head><body>
<header><div><span class="brand">H. L. Sun · Private Notes</span><a href="https://hlsun.org/notes/">Public website ↗</a></div></header>
<main><section class="intro"><p class="meta">Authenticated private workspace</p><h1>Private notes</h1><p class="muted">A quiet working archive. Notes are stored in Cloudflare D1 and are not included in the public website repository.</p></section>
<section class="workspace"><aside class="sidebar"><div class="toolbar"><strong>Notes</strong><button id="new-note">New</button></div><ul id="note-list" class="note-list"><li class="muted">Loading…</li></ul></aside>
<form id="editor" class="editor"><input id="note-id" type="hidden"><label for="title">Title</label><input id="title" maxlength="200" required><label for="body">Markdown</label><textarea id="body" maxlength="200000" spellcheck="true"></textarea><div class="actions"><button class="primary" type="submit">Save note</button><button class="danger" id="delete-note" type="button" hidden>Delete</button></div><p id="status" class="status" role="status"></p></form></section></main>
<script>
const list=document.querySelector('#note-list'),form=document.querySelector('#editor'),idField=document.querySelector('#note-id'),titleField=document.querySelector('#title'),bodyField=document.querySelector('#body'),statusField=document.querySelector('#status'),deleteButton=document.querySelector('#delete-note');let notes=[];
function resetEditor(){idField.value='';titleField.value='';bodyField.value='';deleteButton.hidden=true;statusField.textContent='New note';titleField.focus();renderList()}
function renderList(){list.replaceChildren();if(!notes.length){const li=document.createElement('li');li.className='muted';li.textContent='No notes yet.';list.append(li);return}for(const note of notes){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=note.title;button.setAttribute('aria-current',String(idField.value===note.id));button.addEventListener('click',()=>openNote(note.id));li.append(button);list.append(li)}}
async function loadNotes(){const response=await fetch('/api/notes',{credentials:'same-origin'});if(!response.ok)throw new Error('Unable to load notes');notes=await response.json();renderList()}
async function openNote(id){statusField.textContent='Loading…';const response=await fetch('/api/notes/'+encodeURIComponent(id),{credentials:'same-origin'});if(!response.ok)throw new Error('Unable to load this note');const note=await response.json();idField.value=note.id;titleField.value=note.title;bodyField.value=note.body;deleteButton.hidden=false;statusField.textContent='Last updated '+new Date(note.updated_at).toLocaleString();renderList()}
document.querySelector('#new-note').addEventListener('click',resetEditor);
form.addEventListener('submit',async event=>{event.preventDefault();statusField.textContent='Saving…';const id=idField.value,url=id?'/api/notes/'+encodeURIComponent(id):'/api/notes',method=id?'PUT':'POST';const response=await fetch(url,{method,credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:titleField.value,body:bodyField.value})});if(!response.ok){statusField.textContent='Save failed';return}const note=await response.json();idField.value=note.id;deleteButton.hidden=false;await loadNotes();statusField.textContent='Saved '+new Date(note.updated_at).toLocaleString();renderList()});
deleteButton.addEventListener('click',async()=>{if(!idField.value||!confirm('Delete this note permanently?'))return;statusField.textContent='Deleting…';const response=await fetch('/api/notes/'+encodeURIComponent(idField.value),{method:'DELETE',credentials:'same-origin'});if(!response.ok){statusField.textContent='Delete failed';return}await loadNotes();resetEditor();statusField.textContent='Note deleted'});
loadNotes().catch(error=>{statusField.textContent=error.message;list.replaceChildren()});
</script></body></html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const email = authenticatedEmail(request);
    if (!email) return json({ error: 'Cloudflare Access authentication required' }, 403);

    if (url.pathname === '/' && request.method === 'GET') return html(app);
    if (!url.pathname.startsWith('/api/notes')) return json({ error: 'Not found' }, 404);

    if (request.method !== 'GET' && !validMutationOrigin(request)) return json({ error: 'Invalid request origin' }, 403);

    if (url.pathname === '/api/notes' && request.method === 'GET') {
      const result = await env.DB.prepare('SELECT id, title, updated_at FROM notes ORDER BY updated_at DESC').all<Pick<Note, 'id' | 'title' | 'updated_at'>>();
      return json(result.results ?? []);
    }

    if (url.pathname === '/api/notes' && request.method === 'POST') {
      const payload = await readPayload(request);
      if (!payload) return json({ error: 'Invalid note' }, 400);
      const now = new Date().toISOString();
      const note: Note = { id: crypto.randomUUID(), ...payload, author_email: email, created_at: now, updated_at: now };
      await env.DB.prepare('INSERT INTO notes (id,title,body,author_email,created_at,updated_at) VALUES (?,?,?,?,?,?)').bind(note.id,note.title,note.body,note.author_email,note.created_at,note.updated_at).run();
      return json(note, 201);
    }

    const match = url.pathname.match(/^\/api\/notes\/([0-9a-f-]{36})$/i);
    if (!match) return json({ error: 'Not found' }, 404);
    const id = match[1];

    if (request.method === 'GET') {
      const note = await env.DB.prepare('SELECT * FROM notes WHERE id=?').bind(id).first<Note>();
      return note ? json(note) : json({ error: 'Not found' }, 404);
    }

    if (request.method === 'PUT') {
      const payload = await readPayload(request);
      if (!payload) return json({ error: 'Invalid note' }, 400);
      const existing = await env.DB.prepare('SELECT * FROM notes WHERE id=?').bind(id).first<Note>();
      if (!existing) return json({ error: 'Not found' }, 404);
      const updated: Note = { ...existing, ...payload, author_email: email, updated_at: new Date().toISOString() };
      await env.DB.prepare('UPDATE notes SET title=?,body=?,author_email=?,updated_at=? WHERE id=?').bind(updated.title,updated.body,updated.author_email,updated.updated_at,id).run();
      return json(updated);
    }

    if (request.method === 'DELETE') {
      await env.DB.prepare('DELETE FROM notes WHERE id=?').bind(id).run();
      return json({ ok: true });
    }

    return json({ error: 'Method not allowed' }, 405);
  },
};
