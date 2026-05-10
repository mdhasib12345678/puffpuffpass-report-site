// Client review panel — vanilla JS, no build step.
// Talks to the Medusa backend over fetch() with credentials: 'include'.

const API_BASE = window.CLIENT_API_BASE || "https://puffpuffpass-backend-production.up.railway.app"

const REACTIONS = [
  { kind: "like",     emoji: "👍", label: "Like" },
  { kind: "love",     emoji: "❤️", label: "Love" },
  { kind: "fire",     emoji: "🔥", label: "Fire" },
  { kind: "clap",     emoji: "👏", label: "Clap" },
  { kind: "thinking", emoji: "🤔", label: "Thinking" },
]

const STATUS_LABEL = {
  pending: "Pending",
  in_progress: "In progress",
  done: "Done",
  revision_requested: "Revision requested",
}

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

const $ = (sel, root = document) => root.querySelector(sel)
const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v
    else if (k === "html") node.innerHTML = v
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v)
    else if (v !== undefined && v !== null) node.setAttribute(k, v)
  }
  for (const c of [].concat(children)) {
    if (c == null) continue
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c)
  }
  return node
}

// ---------- Pages ----------

async function showLogin() {
  const root = $("#app")
  root.innerHTML = ""

  const form = el("form", { class: "card", onsubmit: handlePasswordSubmit }, [
    el("h1", {}, "Sign in"),
    el("p", {}, "Enter your email and password."),
    el("label", { class: "field-label" }, "Email"),
    el("input", { type: "email", name: "email", placeholder: "you@company.com", required: "true", autocomplete: "email" }),
    el("label", { class: "field-label", style: "margin-top:12px" }, "Password"),
    el("input", { type: "password", name: "password", placeholder: "••••••••", required: "true", autocomplete: "current-password" }),
    el("div", { style: "margin-top:16px;display:flex;gap:8px;align-items:center" }, [
      el("button", { class: "btn", type: "submit" }, "Sign in"),
      el("span", { class: "muted", id: "login-msg" }, ""),
    ]),
    el("div", { style: "margin-top:14px;padding-top:14px;border-top:1px solid var(--border);font-size:13px;color:var(--text-mute)" }, [
      "Forgot password? ",
      el("a", { href: "#", onclick: switchToMagicLink }, "Sign in with email link"),
    ]),
  ])
  root.appendChild(form)
}

function switchToMagicLink(e) {
  e.preventDefault()
  const root = $("#app")
  root.innerHTML = ""
  const form = el("form", { class: "card", onsubmit: handleMagicSubmit }, [
    el("h1", {}, "Email link"),
    el("p", {}, "Enter your email — we'll send a one-time sign-in link."),
    el("input", { type: "email", name: "email", placeholder: "you@company.com", required: "true", autocomplete: "email" }),
    el("div", { style: "margin-top:14px;display:flex;gap:8px;align-items:center" }, [
      el("button", { class: "btn", type: "submit" }, "Send link"),
      el("span", { class: "muted", id: "login-msg" }, ""),
    ]),
    el("div", { style: "margin-top:14px;padding-top:14px;border-top:1px solid var(--border);font-size:13px" }, [
      el("a", { href: "#", onclick: (ev) => { ev.preventDefault(); showLogin() } }, "← Back to password sign-in"),
    ]),
  ])
  root.appendChild(form)
}

async function handlePasswordSubmit(e) {
  e.preventDefault()
  const email = e.target.email.value.trim()
  const password = e.target.password.value
  const msg = $("#login-msg")
  msg.className = "muted"
  msg.textContent = "Signing in…"
  try {
    const r = await api("/clients/auth/login", { method: "POST", body: { email, password } })
    // Admins go to the admin panel, clients go to the client view.
    location.href = r.user?.is_admin ? "/admin/" : "/client/"
  } catch (err) {
    msg.className = "err"
    msg.textContent = err.status === 401 ? "Invalid email or password" : err.message
  }
}

async function handleMagicSubmit(e) {
  e.preventDefault()
  const email = e.target.email.value.trim()
  const msg = $("#login-msg")
  msg.className = "muted"
  msg.textContent = "Sending…"
  try {
    const r = await api("/clients/auth/request-link", { method: "POST", body: { email } })
    if (r.dev_link) {
      const root = $("#app")
      root.appendChild(el("div", { class: "banner dev" }, [
        "DEV: ",
        el("a", { href: r.dev_link }, r.dev_link),
        el("div", { class: "muted", style: "margin-top:6px;font-family:system-ui" },
          "Resend not configured. Click the link to verify."),
      ]))
      msg.textContent = ""
    } else {
      msg.className = "ok"
      msg.textContent = "Check your email for the link."
    }
  } catch (err) {
    msg.className = "err"
    msg.textContent = err.message
  }
}

async function showVerify() {
  const root = $("#app")
  const params = new URLSearchParams(location.search)
  const token = params.get("token")
  if (!token) {
    root.innerHTML = ""
    root.appendChild(el("div", { class: "card" }, [
      el("h1", {}, "Missing token"),
      el("p", {}, "This link is incomplete. Request a new one from the sign-in page."),
      el("a", { href: "/client/login/", class: "btn btn-ghost btn-sm" }, "Back to sign-in"),
    ]))
    return
  }

  root.innerHTML = ""
  root.appendChild(el("div", { class: "card" }, [
    el("h1", {}, "Signing you in…"),
    el("div", { class: "spinner" }),
  ]))

  try {
    await api("/clients/auth/verify", { method: "POST", body: { token } })
    location.href = "/client/"
  } catch (err) {
    root.innerHTML = ""
    root.appendChild(el("div", { class: "card" }, [
      el("h1", {}, "Sign-in failed"),
      el("p", { class: "err" }, err.message),
      el("a", { href: "/client/login/", class: "btn" }, "Try again"),
    ]))
  }
}

async function showDashboard() {
  const root = $("#app")
  root.innerHTML = ""
  root.appendChild(el("div", { class: "spinner" }))

  let me
  try {
    me = await api("/clients/me")
  } catch (err) {
    if (err.status === 401) {
      location.href = "/client/login/"
      return
    }
    throw err
  }

  // Header
  const header = el("header", { class: "client-header" }, [
    el("div", { class: "client-header-mark" }, "P"),
    el("div", {}, [
      el("div", { class: "client-header-name" }, "PUFF PUFF PASS Reports"),
      el("div", { class: "muted", style: "font-size:12px" }, me.client.name),
    ]),
    el("div", { class: "client-header-meta" }, [
      `${me.user.name || me.user.email} · `,
      el("a", { href: "#", onclick: handleLogout }, "Sign out"),
    ]),
  ])

  root.innerHTML = ""
  document.body.prepend(header)

  if (!me.projects.length) {
    root.appendChild(el("div", { class: "card" }, [
      el("h1", {}, "No projects yet"),
      el("p", {}, "You'll see tasks here once your account has a project assigned."),
    ]))
    return
  }

  const project = me.projects[0]   // single-project simplification for v1
  const data = await api(`/clients/projects/${project.id}/tasks`)

  root.appendChild(el("div", {}, [
    el("h1", {}, project.name),
    el("p", {}, `${data.tasks.length} tasks · click any reaction to flip it · leave a comment to request changes`),
  ]))

  const list = el("div", { class: "task-list" })
  for (const task of data.tasks) list.appendChild(renderTask(task, me))
  root.appendChild(list)
}

function renderTask(task, me) {
  const node = el("article", { class: "task", "data-task-id": task.id })

  const head = el("div", { class: "task-head" }, [
    el("div", { style: "flex:1" }, [
      el("div", { class: "task-title" }, task.title),
      task.category ? el("div", { class: "task-cat" }, task.category) : null,
    ]),
    el("span", { class: `task-status ${task.status}` }, STATUS_LABEL[task.status] || task.status),
  ])

  // Reactions
  const counts = {}
  let myReaction = null
  for (const r of task.reactions || []) {
    counts[r.kind] = (counts[r.kind] || 0) + 1
    if (r.author_type === "client" && r.author_id === me.user.id) myReaction = r.kind
  }
  const reactionsRow = el("div", { class: "reactions" })
  for (const r of REACTIONS) {
    const active = myReaction === r.kind
    reactionsRow.appendChild(
      el("button", {
        class: `react-btn${active ? " active" : ""}`,
        title: r.label,
        onclick: () => toggleReaction(task.id, r.kind, active),
      }, [
        r.emoji,
        counts[r.kind] ? el("span", { class: "react-count" }, ` ${counts[r.kind]}`) : null,
      ])
    )
  }

  // Comments
  const commentsSection = el("div", { class: "comments" })
  for (const c of task.comments || []) commentsSection.appendChild(renderComment(c))

  // Compose
  const compose = el("form", { class: "compose", onsubmit: (e) => submitComment(e, task.id) }, [
    el("textarea", { name: "body", placeholder: "Leave a comment or request changes…" }),
    el("div", { class: "compose-row" }, [
      el("label", {}, [
        el("input", { type: "checkbox", name: "request_revision" }),
        "Request revision",
      ]),
      el("button", { class: "btn btn-sm", type: "submit", style: "margin-left:auto" }, "Send"),
    ]),
  ])

  node.appendChild(head)
  node.appendChild(reactionsRow)
  node.appendChild(commentsSection)
  node.appendChild(compose)
  return node
}

function renderComment(c) {
  const isClient = c.author_type === "client"
  const time = new Date(c.created_at).toLocaleString()
  return el("div", { class: `comment ${isClient ? "client" : "admin"}` }, [
    el("div", { class: "comment-bubble" }, [
      el("div", { class: "comment-meta" }, [
        isClient ? "You" : "Admin",
        " · ",
        time,
        c.request_revision ? " · revision request" : "",
      ]),
      el("div", { class: "comment-body" }, c.body),
    ]),
  ])
}

async function toggleReaction(taskId, kind, isActive) {
  try {
    await api(`/clients/tasks/${taskId}/reactions`, {
      method: "PUT",
      body: { kind: isActive ? null : kind },
    })
    showDashboard()
  } catch (err) {
    alert(err.message)
  }
}

async function submitComment(e, taskId) {
  e.preventDefault()
  const body = e.target.body.value.trim()
  const request_revision = e.target.request_revision.checked
  if (!body) return
  try {
    await api(`/clients/tasks/${taskId}/comments`, {
      method: "POST",
      body: { body, request_revision },
    })
    showDashboard()
  } catch (err) {
    alert(err.message)
  }
}

async function handleLogout(e) {
  e.preventDefault()
  try { await api("/clients/auth/logout", { method: "POST" }) } catch {}
  location.href = "/client/login/"
}

// ---------- Router ----------
const path = location.pathname.replace(/\/$/, "")
if (path.endsWith("/client/login/verify")) showVerify()
else if (path.endsWith("/client/login")) showLogin()
else showDashboard()
