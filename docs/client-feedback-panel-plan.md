# Client-Feedback Panel — Implementation Plan

**Status:** Draft for approval. No code yet.
**Last updated:** 2026-05-10
**Owner:** Hasib

## 1. What we're building

A two-sided system where:
- **Admin (you)** publishes tasks, marks them complete, and sees feedback in real time.
- **Client** browses each completed task, leaves comments, reacts (like / love / fire / etc.), and requests revisions.
- A revision request automatically materializes as a new pending task in the admin view.
- Status, comments, and reactions sync in real time on both sides — no refresh needed.

The client side embeds inside the existing report website (`mediumaquamarine-fish-133779.hostingersite.com/development/admin/` or a new `/client/` route). The admin side lives inside the Medusa admin (`/app/.../client-feedback`).

## 2. Architectural decisions (your answers from earlier)

| Decision | Choice | Rationale |
|---|---|---|
| Backend | **Reuse Medusa backend** | Existing Postgres, auth, deploy pipeline. Cheapest to run. |
| Multi-tenancy | **Multi-client from day one** | Built-in `project_id` scoping on every entity. |
| Realtime | **Live updates via WebSocket** | Socket.io on the Medusa server, joined per-project room. |
| Admin UI | Custom Medusa Admin route | Shipped via Medusa's admin extension API. |
| Client UI | Static HTML + JS bundle | Embedded in the report site, talks to Medusa API over CORS. |
| Auth (admin) | Existing Medusa admin auth | No new login flow. |
| Auth (client) | Magic-link email | No password fatigue; one click from email → 30-day session. |

## 3. Data model — Postgres tables (Medusa MikroORM entities)

```
Project
  id, name, client_id, created_at
  └─ has many Tasks

Client
  id, name, primary_email, created_at
  └─ has many ClientUsers
  └─ has many Projects

ClientUser
  id, client_id, email, name, role (owner|reviewer), last_login_at

Task
  id, project_id, title, description, status (pending|in_progress|done|revision_requested),
  category, ordering, completed_at, created_at, updated_at
  └─ has many Comments
  └─ has many Reactions

Comment
  id, task_id, author_type (admin|client), author_id, body, created_at
  └─ optionally creates a RevisionRequest if flagged

Reaction
  id, task_id, author_type (admin|client), author_id, kind (like|love|fire|clap|thinking),
  created_at
  UNIQUE (task_id, author_id, author_type)  -- one reaction per user per task

RevisionRequest
  id, task_id, comment_id, status (open|addressed), created_at, addressed_at
  -- automatically spawns a follow-up Task with parent_task_id = task_id

Notification
  id, recipient_type (admin|client), recipient_id, kind, payload_json, read_at, created_at
```

Reactions are a single row per (task, user, kind=changeable). Switching from like→love updates the row, doesn't add a second.

## 4. API surface (REST under `/clients/v1/...` and `/admin/v1/...`)

### Client side (auth: magic-link session cookie)
- `GET  /clients/v1/me` — returns `{ client, projects[] }`
- `GET  /clients/v1/projects/:id/tasks` — list tasks (with comments + reactions + revision_status)
- `GET  /clients/v1/tasks/:id` — single task detail
- `POST /clients/v1/tasks/:id/comments` — body `{ text, request_revision: bool }`
- `PUT  /clients/v1/tasks/:id/reactions` — body `{ kind: "love" | null }` (null = remove)

### Admin side (auth: Medusa admin session)
- `GET  /admin/v1/projects/:id/tasks` — list with full activity feed
- `POST /admin/v1/projects/:id/tasks` — create task
- `PATCH /admin/v1/tasks/:id` — update status / fields
- `POST /admin/v1/tasks/:id/comments` — admin reply
- `GET  /admin/v1/notifications` — pending feedback inbox
- `POST /admin/v1/projects` — create project + invite first ClientUser

### Realtime (Socket.io, namespace `/feedback`)
- Client connects with session cookie → joins room `project:<id>`.
- Server broadcasts on the room: `task.updated`, `comment.created`, `reaction.changed`.
- Each broadcast carries the diff so the client merges into its local state.

## 5. Frontend — admin (Medusa Admin extension)

- Route: `/app/projects/:id/feedback`
- Shows the same task list the client sees, plus an inbox panel of unread feedback.
- Reuses Medusa's existing UI primitives (`@medusajs/ui`).
- Socket.io connection auto-opens when the page mounts.
- "Revision requested" tasks bubble to the top with a badge.

## 6. Frontend — client (embedded in report site)

- New page: `/client/login/` (magic-link form) → `/client/` (dashboard)
- Single JS bundle (~30 KB gz) — Preact + Tailwind utility classes inlined.
- Stored locally as `report-site/client/` and served by Hostinger like every other page.
- Talks to Medusa over HTTPS; CORS allowlist updated to include the report site domain.
- Socket.io client connects on dashboard mount.

## 7. Auth flow (magic link)

1. Client enters email at `/client/login/`.
2. POST `/clients/v1/auth/request-link` → server emails a one-time URL `https://.../client/login/verify?token=…`.
3. Client clicks link → server validates token → sets HTTP-only `client_session` cookie (30 days, sliding).
4. All subsequent `/clients/v1/*` requests carry the cookie.
5. Logout: `POST /clients/v1/auth/logout` clears the cookie.

Tokens use the existing JWT secret in Medusa's env. Magic-link emails sent via Resend (recommended; ~$0/mo for low volume) or SMTP.

## 8. Realtime — concrete tech choices

- **Socket.io 4.x** as the adapter (battle-tested, falls back gracefully to long-poll).
- Mounted on the Medusa Express instance under `/socket.io/`.
- Auth handshake reuses the same session cookie used for REST.
- Single Postgres-backed pubsub adapter so we can scale to multiple Medusa instances later if needed.

## 9. Notifications

- **In-app:** the `notifications` table + an admin inbox panel.
- **Email:** Resend transactional emails for: revision requested, comment posted (after 5 min of silence to batch), task marked done.
- Per-client preferences (email frequency: realtime / digest / off) on `ClientUser`.

## 10. Phasing — 3 weeks

### Week 1 — Backend foundation
- Medusa custom module `client-review`: entities, migrations, services.
- Magic-link auth module + Resend integration.
- REST endpoints for tasks, comments, reactions (no realtime yet).
- Seed script: 1 demo client + 10 sample tasks for end-to-end testing.

### Week 2 — Frontends
- Admin UI extension in Medusa admin.
- Client SPA bundle, deployed under `/client/` on the report site.
- CORS, session cookie, end-to-end flows working with manual refresh.

### Week 3 — Realtime + polish
- Socket.io server + client wiring.
- Reaction roll-up, comment threading, revision-request → follow-up task automation.
- Email notifications via Resend.
- QA pass, accessibility check, deploy to production.

## 11. Risks / open questions

- **Hostinger CORS:** the report site needs to call the Medusa API on a different domain (probably Railway). Verified Medusa supports `STORE_CORS` / `ADMIN_CORS` envs — we'll add a third `CLIENT_CORS` for the report-site origin.
- **Magic-link deliverability:** Resend free tier is 100/day and 3k/mo — fine for this use case. Backup: configure SMTP via Hostinger's email service.
- **WebSocket through Cloudflare/Railway:** Both support WS by default; need to confirm no proxy in front strips the `Upgrade` header.
- **Bundle size on report site:** Preact instead of React keeps it under 30 KB. If client-side state grows, swap to a lightweight store like Nano Stores.

## 12. What I need from you to start Week 1

1. ✅ Architecture answers (have them).
2. Approval to add a custom Medusa module to the existing backend.
3. A Resend account (free tier; takes 2 min to sign up at resend.com).
4. Decision on the client login URL: `/client/` or `/clients/` or something else.
5. Brand decisions for the client UI:
   - Logo color: brand green `#075E54` (yes/no)
   - Reaction set: like, love, fire, clap, thinking (yes / pick a different set)
   - Magic-link email "From" name: "PUFF PUFF PASS Reports" (yes/no)

Once these are answered, Week 1 starts.
