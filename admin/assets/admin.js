// Admin panel — vanilla JS, no build step.
// Reuses /client/assets/client.css for base styling.

const API_BASE = window.CLIENT_API_BASE || "https://puffpuffpass-backend-production.up.railway.app"

const STATUS_LABEL = {
  pending: "Pending",
  in_progress: "In progress",
  done: "Done",
  revision_requested: "Revision requested",
}
const STATUS_ORDER = ["pending", "in_progress", "done", "revision_requested"]

async function api(path, opts = {}) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: opts.method || "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  let data = null
  try { data = await r.json() } catch {}
  if (!r.ok) {
    const err = new Error(data?.message || `HTTP ${r.status}`)
    err.status = r.status
    err.data = data
    throw err
  }
  return data
}

const $ = (s, r = document) => r.querySelector(s)
const el = (tag, attrs = {}, children = []) => {
  const n = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v
    else if (k === "html") n.innerHTML = v
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v)
    else if (v !== undefined && v !== null) n.setAttribute(k, v)
  }
  for (const c of [].concat(children)) {
    if (c == null) continue
    n.appendChild(typeof c === "string" ? document.createTextNode(c) : c)
  }
  return n
}

// ──────────────────────────── pages ────────────────────────────

async function showAdminLogin() {
  const root = $("#app")
  root.innerHTML = ""
  root.appendChild(el("form", { class: "card", onsubmit: handleAdminLogin }, [
    el("h1", {}, "Admin sign in"),
    el("p", {}, "PUFF PUFF PASS staff only."),
    el("label", { class: "field-label" }, "Email"),
    el("input", { type: "email", name: "email", placeholder: "admin@puffpuffpass.com", required: "true", autocomplete: "email" }),
    el("label", { class: "field-label", style: "margin-top:12px" }, "Password"),
    el("input", { type: "password", name: "password", required: "true", autocomplete: "current-password" }),
    el("div", { style: "margin-top:16px;display:flex;gap:8px;align-items:center" }, [
      el("button", { class: "btn", type: "submit" }, "Sign in"),
      el("span", { class: "muted", id: "msg" }, ""),
    ]),
  ]))
}

async function handleAdminLogin(e) {
  e.preventDefault()
  const email = e.target.email.value.trim()
  const password = e.target.password.value
  const msg = $("#msg")
  msg.className = "muted"
  msg.textContent = "Signing in…"
  try {
    const r = await api("/clients/auth/login", { method: "POST", body: { email, password } })
    if (!r.user) throw new Error("Login failed")
    location.href = "/admin/"
  } catch (err) {
    msg.className = "err"
    msg.textContent = err.status === 401 ? "Invalid email or password" : err.message
  }
}

async function showDashboard() {
  const root = $("#app")
  root.innerHTML = ""
  root.appendChild(el("div", { class: "spinner" }))

  let me, dash
  try {
    me = await api("/clients/me")
  } catch (err) {
    if (err.status === 401) { location.href = "/admin/login/"; return }
    throw err
  }
  if (!me.user.is_admin) {
    root.innerHTML = ""
    root.appendChild(el("div", { class: "card" }, [
      el("h1", {}, "Not an admin"),
      el("p", {}, "Your account doesn't have admin access. Switch to the client view."),
      el("a", { href: "/client/", class: "btn" }, "Open client view"),
    ]))
    return
  }

  try {
    dash = await api("/clients/admin/dashboard")
  } catch (err) {
    if (err.status === 401) { location.href = "/admin/login/"; return }
    if (err.status === 403) {
      root.innerHTML = ""
      root.appendChild(el("div", { class: "card" }, [
        el("h1", {}, "Forbidden"),
        el("p", {}, "Your account is not flagged as admin."),
      ]))
      return
    }
    throw err
  }

  root.innerHTML = ""

  // Header
  document.body.prepend(el("header", { class: "client-header admin-header" }, [
    el("div", { class: "client-header-mark" }, "P"),
    el("div", {}, [
      el("div", { class: "client-header-name" }, "Admin · PUFF PUFF PASS"),
      el("div", { class: "muted", style: "font-size:12px" }, `${dash.summary.clients_total} clients · ${dash.summary.projects_total} projects`),
    ]),
    el("div", { class: "client-header-meta" }, [
      `${me.user.name || me.user.email} · `,
      el("a", { href: "#", onclick: handleLogout }, "Sign out"),
    ]),
  ]))

  // KPIs
  root.appendChild(el("div", { class: "kpi-row" }, [
    kpi("Pending revisions", dash.summary.pending_revisions_total, dash.summary.pending_revisions_total > 0),
    kpi("Total tasks", dash.summary.tasks_total),
    kpi("Projects", dash.summary.projects_total),
    kpi("Clients", dash.summary.clients_total),
  ]))

  // Pending revisions inbox
  root.appendChild(el("h2", { class: "section-h" }, "Revision requests"))
  if (dash.pending_revisions.length === 0) {
    root.appendChild(el("div", { class: "empty-state" }, "No pending revision requests. You're caught up."))
  } else {
    const list = el("div", { class: "task-list" })
    for (const t of dash.pending_revisions) list.appendChild(renderTaskCard(t, me, /*isInbox*/ true))
    root.appendChild(list)
  }

  // All clients & projects
  root.appendChild(el("h2", { class: "section-h" }, "Clients & projects"))
  for (const c of dash.clients) {
    const card = el("div", { class: "client-card" }, [
      el("div", { class: "client-card-name" }, c.name),
      el("div", { class: "client-card-meta" }, `${c.primary_email} · ${c.tasks_total} tasks · ${c.tasks_pending_revision} pending revisions`),
    ])
    for (const p of c.projects) {
      card.appendChild(el("div", { style: "margin-top:10px;padding:10px 12px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:rgba(15,23,42,0.02)", onclick: () => loadProject(p.id) }, [
        el("div", { style: "display:flex;justify-content:space-between;align-items:baseline" }, [
          el("strong", {}, p.name),
          el("span", { class: "muted" }, `${p.counts.done}/${p.counts.total} done`),
        ]),
        el("div", { class: "muted", style: "font-size:12px;margin-top:2px" },
          `${p.counts.in_progress} in progress · ${p.counts.pending} pending · ${p.counts.revision_requested} revisions`),
      ]))
    }
    root.appendChild(card)
  }
}

async function loadProject(projectId) {
  const root = $("#app")
  // scroll to top + show loader
  window.scrollTo({ top: 0, behavior: "smooth" })
  const me = await api("/clients/me")
  const data = await api(`/clients/admin/projects/${projectId}/tasks`)

  root.innerHTML = ""
  root.appendChild(el("a", { href: "#", class: "btn btn-ghost btn-sm", onclick: (e) => { e.preventDefault(); showDashboard() }, style: "margin-bottom:14px" }, "← Back to dashboard"))
  root.appendChild(el("h1", {}, data.project.name))
  root.appendChild(el("p", {}, `${data.client?.name || "Unknown client"} · ${data.tasks.length} tasks`))

  const list = el("div", { class: "task-list" })
  for (const t of data.tasks) list.appendChild(renderTaskCard(t, me, false))
  root.appendChild(list)
}

function renderTaskCard(task, me, isInbox) {
  const isAutoRevision = !!task.parent_task_id
  const node = el("article", {
    class: `task task-admin${task.status === "revision_requested" ? " urgent" : ""}${isAutoRevision ? " auto-revision" : ""}`,
    "data-task-id": task.id,
  })

  const head = el("div", { class: "task-head" }, [
    el("div", { style: "flex:1" }, [
      el("div", { class: "task-title" }, [
        isAutoRevision ? el("span", { class: "auto-tag", title: "Auto-created from a client revision request" }, "🔄 ") : null,
        task.title,
      ]),
      el("div", { class: "task-cat" },
        [task.category, isInbox && task.client?.name ? `${task.client.name} → ${task.project?.name}` : null].filter(Boolean).join(" · ")
      ),
    ]),
    el("span", { class: `task-status ${task.status}` }, STATUS_LABEL[task.status]),
  ])

  // Editable description / progress notes
  const desc = el("div", { class: "task-desc-editor", style: "margin-top:10px" }, [
    el("textarea", {
      class: "task-desc-input",
      placeholder: "What did you do? Paste a preview link, screenshot URL, or progress notes…",
      "data-original": task.description || "",
    }, task.description || ""),
    el("div", { style: "display:flex;gap:6px;margin-top:6px;justify-content:flex-end" }, [
      el("button", {
        class: "btn btn-ghost btn-sm",
        onclick: (e) => saveDescription(e, task.id),
      }, "Save notes"),
    ]),
  ])

  // Status switcher
  const statusRow = el("div", { class: "task-status-row" })
  for (const s of STATUS_ORDER) {
    statusRow.appendChild(el("button", {
      class: `status-btn${task.status === s ? ` active ${s}` : ""}`,
      title: STATUS_LABEL[s],
      onclick: () => updateStatus(task.id, s),
    }, STATUS_LABEL[s]))
  }

  // Reactions read-only (admin sees what client reacted)
  const reactions = task.reactions || []
  const counts = {}
  for (const r of reactions) counts[r.kind] = (counts[r.kind] || 0) + 1
  const reactionsRow = Object.keys(counts).length ? el("div", { style: "margin-top:10px;font-size:13px;color:var(--text-mute)" },
    "Client reactions: " + Object.entries(counts).map(([k, n]) => `${emoji(k)} ${n}`).join("  ")
  ) : null

  // Comments
  const commentsSection = el("div", { class: "comments" })
  const comments = task.comments || []
  for (const c of comments) commentsSection.appendChild(renderComment(c))

  // Reply form
  const reply = el("form", { class: "compose", onsubmit: (e) => submitReply(e, task.id) }, [
    el("textarea", { name: "body", placeholder: "Reply to client…" }),
    el("button", { class: "btn btn-sm", type: "submit", style: "align-self:flex-start" }, "Send reply"),
  ])

  node.appendChild(head)
  node.appendChild(desc)
  node.appendChild(statusRow)
  if (reactionsRow) node.appendChild(reactionsRow)
  if (comments.length) node.appendChild(commentsSection)
  node.appendChild(reply)
  return node
}

async function saveDescription(e, taskId) {
  e.preventDefault()
  const card = e.target.closest("article")
  const ta = card.querySelector(".task-desc-input")
  const newDesc = ta.value
  try {
    await api(`/clients/admin/tasks/${taskId}`, {
      method: "PATCH",
      body: { description: newDesc },
    })
    ta.dataset.original = newDesc
    e.target.textContent = "Saved ✓"
    setTimeout(() => { e.target.textContent = "Save notes" }, 1400)
  } catch (err) { alert(err.message) }
}

function emoji(kind) {
  return { approved: "✅", like: "👍", love: "❤️", fire: "🔥", clap: "👏", thinking: "🤔" }[kind] || kind
}

function renderComment(c) {
  const isClient = c.author_type === "client"
  return el("div", { class: `comment ${isClient ? "client" : "admin"}` }, [
    el("div", { class: "comment-bubble" }, [
      el("div", { class: "comment-meta" },
        `${isClient ? "Client" : "You (admin)"} · ${new Date(c.created_at).toLocaleString()}${c.request_revision ? " · revision request" : ""}`
      ),
      el("div", { class: "comment-body" }, c.body),
    ]),
  ])
}

async function updateStatus(taskId, status) {
  try {
    await api(`/clients/admin/tasks/${taskId}`, { method: "PATCH", body: { status } })
    showDashboard()
  } catch (err) { alert(err.message) }
}

async function submitReply(e, taskId) {
  e.preventDefault()
  const body = e.target.body.value.trim()
  if (!body) return
  try {
    await api(`/clients/admin/tasks/${taskId}/comments`, { method: "POST", body: { body } })
    showDashboard()
  } catch (err) { alert(err.message) }
}

async function handleLogout(e) {
  e.preventDefault()
  try { await api("/clients/auth/logout", { method: "POST" }) } catch {}
  location.href = "/admin/login/"
}

function kpi(label, value, urgent) {
  return el("div", { class: `kpi${urgent ? " urgent" : ""}` }, [
    el("div", { class: "kpi-label" }, label),
    el("div", { class: "kpi-value" }, String(value)),
  ])
}

// ──────────────────────────── router ────────────────────────────
const path = location.pathname.replace(/\/$/, "")
if (path.endsWith("/admin/login")) showAdminLogin()
else showDashboard()
