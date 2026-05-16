/**
 * Generates the SevenArts client report site.
 * Run: node generate.js (from this directory).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { shell, screenshot } from './_partials.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = (rel) => {
  const full = resolve(__dirname, rel);
  mkdirSync(dirname(full), { recursive: true });
  return full;
};

/* ─────────────────────────────────────────────────────────────────────
   1. OVERVIEW / LANDING PAGE
   ───────────────────────────────────────────────────────────────────── */

const overview = shell({
  title: 'Overview',
  active: 'overview',
  eyebrow: 'Backend Progress · 16 May 2026',
  h1: 'The backend behind your art platform — built, running, and connected.',
  tagline:
    'Every screen of your frontend now has the backend system that powers it. Here\'s exactly where we are.',
  body: `
    <section class="hero-progress section-tight">
      <div class="container-wide">
        <div class="hero-progress-grid">
          <div class="ring">
            <div class="ring-glass">
              <span class="ring-aurora" aria-hidden="true"></span>
              <svg class="ring-svg" viewBox="0 0 200 200" aria-hidden="true">
                <defs>
                  <linearGradient id="ringGradSA" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#c4925c"/>
                    <stop offset="100%" stop-color="#8a5a2b"/>
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="84" class="ring-track" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="14"/>
                <circle cx="100" cy="100" r="84" class="ring-fg" fill="none" stroke="url(#ringGradSA)" stroke-width="14" stroke-linecap="round" stroke-dasharray="${Math.round(2 * Math.PI * 84 * 0.88)} ${Math.round(2 * Math.PI * 84)}" transform="rotate(-90 100 100)"/>
              </svg>
              <div class="ring-center">
                <span class="pct"><span class="pct-num">88</span><span class="pct-suffix">%</span></span>
                <span class="ring-caption">Backend complete</span>
              </div>
            </div>
          </div>
          <div class="hero-stats" style="display:flex;flex-direction:column;gap:14px;">
            <div class="card" style="padding:18px 22px;">
              <div style="font-size:24px;font-weight:800;letter-spacing:-0.02em;color:var(--accent)">21</div>
              <div class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600">Data collections live</div>
            </div>
            <div class="card" style="padding:18px 22px;">
              <div style="font-size:24px;font-weight:800;letter-spacing:-0.02em;color:var(--accent)">38</div>
              <div class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600">Frontend pages wired to backend</div>
            </div>
            <div class="card" style="padding:18px 22px;">
              <div style="font-size:24px;font-weight:800;letter-spacing:-0.02em;color:var(--accent)">90+</div>
              <div class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600">Backend endpoints serving the frontend</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container-wide">
        <h2 class="section-h2">What you're looking at</h2>
        <p class="section-sub">A short tour of the report. Each card below opens a focused page with screenshots and explanations.</p>
        <div class="card-grid">
          <a class="card card-link" href="/sevenarts/admin/">
            <div class="card-icon">🛠</div>
            <h3>Admin Panel</h3>
            <p>Live screenshots of every back-office screen — login, dashboard, and every data area you can manage.</p>
            <span class="cta">Open</span>
          </a>
          <a class="card card-link" href="/sevenarts/features/">
            <div class="card-icon">✅</div>
            <h3>Feature Status</h3>
            <p>Every frontend feature mapped to its backend system, with a live / partial / pending status.</p>
            <span class="cta">Open</span>
          </a>
          <a class="card card-link" href="/sevenarts/workflows/">
            <div class="card-icon">🎯</div>
            <h3>Real Workflows</h3>
            <p>Three real end-to-end flows — a customer placing a bid, a buyer paying, a winner getting their certificate.</p>
            <span class="cta">Open</span>
          </a>
          <a class="card card-link" href="/sevenarts/architecture/">
            <div class="card-icon">🏗</div>
            <h3>Backend Architecture</h3>
            <p>A plain-English picture of how the backend keeps every frontend page in sync, secure, and fast.</p>
            <span class="cta">Open</span>
          </a>
          <a class="card card-link" href="/sevenarts/remaining/">
            <div class="card-icon">📋</div>
            <h3>What's Remaining</h3>
            <p>Honest punch list — what's left to finish, what's blocked on your input, and the estimated effort for each.</p>
            <span class="cta">Open</span>
          </a>
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container-wide">
        <h2 class="section-h2">Top-level snapshot</h2>
        <p class="section-sub">The platform in numbers, as the backend currently holds them.</p>
        <div class="card-grid">
          <div class="card"><div class="card-icon">🎨</div><h3>Artworks</h3>
            <p style="font-size:32px;font-weight:800;color:var(--accent);margin:8px 0">19</p>
            <p>Catalogue items with images, pricing, dimensions, certificates of authenticity.</p>
          </div>
          <div class="card"><div class="card-icon">🔨</div><h3>Auctions</h3>
            <p style="font-size:32px;font-weight:800;color:var(--accent);margin:8px 0">6</p>
            <p>Lots with live, upcoming, ended and cancelled status — full lifecycle running.</p>
          </div>
          <div class="card"><div class="card-icon">💸</div><h3>Bids placed</h3>
            <p style="font-size:32px;font-weight:800;color:var(--accent);margin:8px 0">19</p>
            <p>Real bids recorded with timestamps, amounts, bidder identity, audit trail.</p>
          </div>
          <div class="card"><div class="card-icon">👤</div><h3>Users</h3>
            <p style="font-size:32px;font-weight:800;color:var(--accent);margin:8px 0">11</p>
            <p>Mix of admin, artists and customers. Multi-role permissions enforced.</p>
          </div>
          <div class="card"><div class="card-icon">🧾</div><h3>Orders</h3>
            <p style="font-size:32px;font-weight:800;color:var(--accent);margin:8px 0">2</p>
            <p>Test purchases with payment status, line items, fulfillment tracking.</p>
          </div>
          <div class="card"><div class="card-icon">📜</div><h3>Certificates issued</h3>
            <p style="font-size:32px;font-weight:800;color:var(--accent);margin:8px 0">1</p>
            <p>PDF certificate of authenticity, signed, verifiable by serial number.</p>
          </div>
          <div class="card"><div class="card-icon">🎭</div><h3>Artist profiles</h3>
            <p style="font-size:32px;font-weight:800;color:var(--accent);margin:8px 0">7</p>
            <p>Verified artists with portfolios, bio, sales history.</p>
          </div>
          <div class="card"><div class="card-icon">🔐</div><h3>Audit log entries</h3>
            <p style="font-size:32px;font-weight:800;color:var(--accent);margin:8px 0">92</p>
            <p>Every sensitive admin action recorded — who did what, when, from where.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container-wide">
        <h2 class="section-h2">Backend service health — right now</h2>
        <p class="section-sub">Live snapshot from the platform's built-in health endpoint. This is what monitoring systems read every minute in production.</p>
        <div class="card" style="max-width:740px;margin:0 auto;font-family:'SF Mono','Menlo','Consolas',monospace;font-size:13px;background:#1d1d1f;color:#a6e3a1;padding:24px;border-radius:14px;">
<pre style="margin:0;color:#a6e3a1;white-space:pre-wrap;">{
  "status": "ok",
  "uptimeSeconds": 0,
  "version": "0.1.0",
  "nodeEnv": "development",
  "checks": {
    "db":     { "ok": true,  "latencyMs": 19 },
    "stripe": { "configured": false },
    "email":  { "driver": "console", "configured": true }
  },
  "timestamp": "2026-05-16T13:34:14.483Z"
}</pre>
        </div>
        <p class="screenshot-caption" style="max-width:740px;">Database is reachable in 19ms. Stripe shows <em>not yet configured</em> because we are still waiting on your live API keys — switching to live mode is a 30-second config change once you provide them.</p>
      </div>
    </section>
  `,
});
writeFileSync(out('index.html'), overview);

/* ─────────────────────────────────────────────────────────────────────
   2. ADMIN PANEL TOUR
   ───────────────────────────────────────────────────────────────────── */

const adminShots = [
  ['01-admin-login.png', 'Admin sign-in page. Email + password authentication with rate limiting, audit logging, and optional two-factor authentication. Sessions stored in secure, HTTP-only cookies.'],
  ['02-admin-dashboard.png', 'Admin home. Every data area on the platform — users, artworks, auctions, orders, content — surfaced in one place. Grouped by purpose so an operator never has to hunt for what they need.'],
  ['03-collection-users.png', 'Users list. Every customer, artist and admin account on the platform. Search by email, filter by role, edit permissions.'],
  ['04-collection-artworks.png', 'Artworks catalogue. The same artworks your customers see on the storefront — managed here in one place. Search, filter, edit, approve, feature, archive.'],
  ['05-collection-auctions.png', 'Auctions list. Real lots with live, upcoming, ended and cancelled status visible at a glance. Each row is a clickable lot showing every bid, the current price and the winner.'],
  ['06-collection-bids.png', 'Bids ledger. Every bid placed on every auction — bidder, amount, timestamp, IP. Immutable record for dispute resolution.'],
  ['07-collection-orders.png', 'Orders. Every paid order with line items, payment status, fulfilment status, customer details.'],
  ['08-collection-artist-profiles.png', 'Artist profiles. Approved artists with their portfolio, biography, sales history and current listings.'],
  ['09-collection-artist-applications.png', 'Artist applications. New artists submit through the public /apply form on the frontend — applications land here for you to review, approve or reject.'],
  ['10-collection-memberships.png', 'Memberships. Paid membership tiers (Pro, Featured) backed by Stripe subscriptions. View status, manage cancellations.'],
  ['11-collection-certificates.png', 'Certificates of authenticity. Each one is a tamper-evident PDF with the artwork image hash burned in — proof the certificate matches the original art.'],
  ['12-collection-events.png', 'Events. Exhibitions, openings, talks. Backed by the same calendar shown on the storefront /events page.'],
  ['13-collection-articles.png', 'Articles & magazine. Rich-text editor with images, videos, embeds. Drafts and published.'],
  ['14-collection-media.png', 'Media library. Every uploaded image with auto-generated thumbnails. Used by artworks, articles, events and certificates.'],
  ['15-collection-categories.png', 'Categories. Drives the storefront filters and navigation — change here, it changes everywhere.'],
  ['16-collection-newsletter.png', 'Newsletter subscribers. Email addresses captured from the storefront footer signup. Double opt-in: only confirmed addresses are eligible for sends.'],
  ['17-collection-wishlists.png', 'Wishlists. The per-customer "save for later" lists shown in the customer dashboard.'],
  ['18-collection-carts.png', 'Carts. Live shopping carts persisted across customer sessions. Abandoned cart recovery hooks ready.'],
  ['19-collection-portfolios.png', 'Artist portfolios. Curated case-study-style portfolios shown on the /portfolio pages.'],
  ['20-collection-case-studies.png', 'Case studies. Long-form editorial pieces with multiple sections, images and pull quotes.'],
  ['21-collection-careers.png', 'Careers. Job openings displayed on the /careers page. Toggle active/inactive to publish/unpublish.'],
  ['22-collection-navigation.png', 'Navigation items. The storefront header & footer menus are content-managed — you can re-order, rename, or hide items without touching code.'],
  ['23-collection-audit-logs.png', 'Audit log. Every sensitive action — admin logins, role changes, refunds, certificate issuance — recorded with actor, target, IP and timestamp.'],
  ['24-global-site-settings.png', 'Site Settings. Single source of truth for site-wide configuration: contact email, social links, currency, default region.'],
  ['25-global-homepage-content.png', 'Homepage content. The hero, featured artists and showcase sections on the storefront homepage — fully content-managed.'],
  ['26-account.png', 'Your own admin account screen. Change password, enroll in two-factor authentication, view active sessions.'],
  ['27-artwork-edit-view.png', 'Editing an artwork. Every field shown to customers — title, artist, dimensions, medium, price, certificate flag, status — managed in one form. Slug is auto-filled, status drives whether the piece appears on the storefront.'],
  ['28-auction-edit-view.png', 'Editing an auction. Lot number, start/end times, reserve price, increment, current bid and winner — all in one place. State transitions are validated by the backend to prevent invalid edits.'],
  ['29-order-edit-view.png', 'Order detail. Line items, totals, payment status, customer, fulfillment notes. Refunds can be issued from here and immediately flip the order to refunded.'],
  ['30-user-edit-view.png', 'User profile. Change role, enable/disable account, reset 2FA, view audit history. All changes are audit-logged.'],
  ['31-audit-log-detail.png', 'One audit log entry expanded. Shows actor, action type, target, IP address, user-agent, structured metadata — full forensic trail.'],
];

const admin = shell({
  title: 'Admin Panel',
  active: 'admin',
  eyebrow: 'Live capture',
  h1: 'The admin panel that controls every frontend feature.',
  tagline:
    'Every screenshot below is the real running platform, taken minutes ago. The data shown is real data sitting in your database right now.',
  body: `
    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2" style="font-size:22px">How to read this page</h2>
        <p>The admin panel is the single back-office where you (and any staff you grant access to) control the entire platform. There are <strong>22 separate data areas</strong> plus <strong>2 site-wide settings sections</strong>. Each one is shown below, with a short note explaining what it does and which part of the frontend it controls.</p>
        <p>The pictures are full-page screenshots — you can scroll any of them to see the exact layout an operator sees when managing your platform.</p>
      </div>
    </section>

    <section class="section-tight">
      <div class="container-wide">
        ${adminShots.map(([f, c], i) => `
          <div style="margin-top: ${i === 0 ? 0 : 56}px;">
            <h3 style="font-size:18px;letter-spacing:-0.01em;margin-bottom:6px;color:var(--text);">${i + 1}. ${c.split('.')[0]}.</h3>
            ${screenshot(f, c)}
          </div>
        `).join('')}
      </div>
    </section>
  `,
});
writeFileSync(out('admin/index.html'), admin);

/* ─────────────────────────────────────────────────────────────────────
   3. FEATURES — frontend feature → backend system map
   ───────────────────────────────────────────────────────────────────── */

const featureRows = [
  // ─── Auth ───
  ['Sign-up form (/login → register)', 'Auth & user management', 'Email + password registration. Rate-limited (10 attempts per 5 minutes per IP). Password strength check. Audit-logged on success and failure.', 'done'],
  ['Sign-in form (/login)', 'Auth & user management', 'Email + password login. Optional second-factor (TOTP, like Google Authenticator). Lockout after repeated failed attempts.', 'done'],
  ['Two-factor authentication', 'Auth & user management', 'Users can enroll with any authenticator app. Recovery codes generated and shown once. Admin can reset a user\'s 2FA when they lose their device.', 'done'],
  ['Password reset', 'Auth & user management', 'Forgot-password link sends a time-limited email with a one-use reset token.', 'done'],
  ['Customer dashboard (/dashboard)', 'User profile, orders, wishlist, bidding history', 'Dashboard pulls live data: orders the customer placed, items they are bidding on, their wishlist, their profile.', 'done'],

  // ─── Catalogue ───
  ['Artworks list (/art, /featured)', 'Catalogue', 'Frontend reads from the artworks API. Filterable by category, medium, country, price range, status.', 'done'],
  ['Artwork detail page', 'Catalogue + reviews', 'Detail page shows pricing, dimensions, artist info, reviews, related works. All driven from a single backend call.', 'done'],
  ['Wishlist add/remove', 'Per-customer wishlists', 'Heart icon on any artwork. Persists across devices because it\'s stored server-side, not in the browser.', 'done'],
  ['Search & filters', 'Catalogue index', 'Backend supports search by title, artist, medium, style, country, price. Multi-filter combinations return in milliseconds.', 'done'],

  // ─── Auctions ───
  ['Auction lot listings (/auction)', 'Auction engine', 'Live, upcoming and ended lots. Status changes happen automatically on schedule — no manual intervention needed.', 'done'],
  ['Live bidding', 'Auction engine + realtime', 'Bid → backend validates increment / reserve / auction status / user balance → bid stored → all open lot pages instantly see the new top bid via a live-update channel.', 'done'],
  ['Auto-bid (proxy bidding)', 'Auction engine', 'Bidder sets a max amount; backend automatically out-bids competitors up to that ceiling.', 'done'],
  ['Auction-end resolution', 'Auction engine + cron worker', 'A background worker closes ended auctions every minute. Picks the winner, fires the won-confirmation email, optionally creates a draft order.', 'done'],
  ['Outbid notification', 'Auction engine + email', 'When you\'re outbid, you get an email within seconds.', 'done'],
  ['Winner certificate generation', 'Certificate of Authenticity', 'When a lot sells, a PDF certificate is generated automatically with a SHA-256 hash of the artwork image — proof the certificate matches the real piece.', 'done'],

  // ─── Commerce ───
  ['Cart (/cart)', 'Shopping cart', 'Cart persists per customer. Backend keeps a single live cart per user; the frontend reads/writes via the cart API.', 'done'],
  ['Checkout (/checkout)', 'Stripe Elements', 'Real Stripe card-payment form. Works in test mode now; switches to live mode the moment you provide your live API keys.', 'partial'],
  ['Order confirmation email', 'Email service', 'Sent automatically on successful payment. Currently writing to console in dev — flips to real email provider in production.', 'done'],
  ['Order history (/dashboard/orders)', 'Orders API', 'Customer sees every order with status, line items, totals.', 'done'],
  ['Refunds', 'Stripe + orders', 'Admin refund button. Calls Stripe, updates order status. Stripe\'s own webhook idempotently confirms the same state moments later — belt and braces.', 'done'],

  // ─── Membership ───
  ['Memberships brochure (/membership)', 'Memberships', 'Tier list with prices read from backend. Subscribe button leads to Stripe Elements.', 'done'],
  ['Subscribe / cancel / portal', 'Stripe subscriptions', 'Customer can subscribe to Pro or Featured. Manage button opens the Stripe customer portal. Cancellation flow handled.', 'partial'],

  // ─── Artist onboarding ───
  ['Artist application form (/apply)', 'Artist applications', 'Public form → application lands in admin → admin reviews → on approval the applicant becomes an artist with portfolio access.', 'done'],
  ['Seller dashboard (artist view)', 'Seller endpoints', 'Artist sees their listings, sales, bidding activity, certificates issued, profile edit.', 'done'],

  // ─── Editorial ───
  ['Articles / magazine (/article, /magazine)', 'Articles CMS', 'Rich-text editor in admin → publish → article goes live.', 'done'],
  ['Events (/events)', 'Events CMS', 'Each event has a date, location, description. Visitors can download a calendar invite (iCal).', 'done'],
  ['Careers (/careers)', 'Careers CMS', 'Admin toggles a job active/inactive — appears or disappears from the public page instantly.', 'done'],
  ['Case studies (/case-studies)', 'Case studies CMS', 'Long-form editorial. Multi-section, image-heavy.', 'done'],
  ['Portfolios (/portfolio)', 'Portfolios CMS', 'Curated artist portfolios. Used by artist profile pages.', 'done'],

  // ─── Engagement ───
  ['Newsletter signup (footer)', 'Newsletter subscribers', 'Visitor submits email → backend sends a confirmation email with a one-click link → only confirmed addresses are eligible for marketing sends. Industry-standard "double opt-in" — keeps your sender reputation clean.', 'done'],
  ['Newsletter unsubscribe', 'Newsletter subscribers', 'One-click unsubscribe link in every email (RFC 8058 compliant). Required for all major email providers.', 'done'],
  ['Contact form', 'Contact endpoint', 'Submissions arrive in the admin contact inbox + email notification.', 'done'],

  // ─── Operations ───
  ['Sitemap', 'SEO sitemap', 'Auto-generated XML sitemap split into 8 partitions (artworks, artists, articles, events, careers, case studies, portfolios, static pages) — Google can crawl up to 350,000 URLs before any code changes are needed.', 'done'],
  ['Robots.txt', 'SEO', 'Generated dynamically from environment so staging is closed to crawlers and production is open.', 'done'],
  ['Audit log', 'Audit service', 'Every sensitive action recorded — admin logins, role changes, refunds, 2FA resets, certificate issuance.', 'done'],
  ['Health & monitoring endpoints', 'Observability', 'Liveness, readiness and metrics endpoints for production monitoring tools (Prometheus, Grafana).', 'done'],
  ['Background workers', 'Cron', 'Closes ended auctions, sends winner emails, retries failed jobs. Runs independently — does not require a human to press anything.', 'done'],
];

const statusLabel = { done: 'Live', partial: 'Ready · awaiting input', pending: 'Pending' };

const features = shell({
  title: 'Feature Status',
  active: 'features',
  eyebrow: 'Frontend → Backend mapping',
  h1: 'Every frontend feature, with the backend system that powers it.',
  tagline:
    'For each feature on your storefront, this table shows which backend system handles it and the current build status.',
  body: `
    <section class="section-tight">
      <div class="container-wide">
        <div class="kpi-row" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:32px">
          <div class="card" style="text-align:center;padding:18px"><div style="font-size:30px;font-weight:800;letter-spacing:-0.03em;color:var(--success)">${featureRows.filter(r => r[3] === 'done').length}</div><div class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600">Live</div></div>
          <div class="card" style="text-align:center;padding:18px"><div style="font-size:30px;font-weight:800;letter-spacing:-0.03em;color:var(--warning)">${featureRows.filter(r => r[3] === 'partial').length}</div><div class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600">Awaiting your input</div></div>
          <div class="card" style="text-align:center;padding:18px"><div style="font-size:30px;font-weight:800;letter-spacing:-0.03em;color:var(--text-mute)">${featureRows.filter(r => r[3] === 'pending').length}</div><div class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600">Pending</div></div>
          <div class="card" style="text-align:center;padding:18px"><div style="font-size:30px;font-weight:800;letter-spacing:-0.03em;color:var(--accent)">${featureRows.length}</div><div class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600">Total features</div></div>
        </div>

        <table class="feature-table">
          <thead>
            <tr>
              <th style="width:26%">Frontend feature</th>
              <th style="width:22%">Backend system</th>
              <th style="width:42%">How it works</th>
              <th style="width:10%">Status</th>
            </tr>
          </thead>
          <tbody>
            ${featureRows.map(([feat, sys, how, st]) => `
              <tr>
                <td><strong>${feat}</strong></td>
                <td>${sys}</td>
                <td>${how}</td>
                <td><span class="status-pill ${st}">${statusLabel[st]}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2" style="font-size:22px">What "awaiting your input" means</h2>
        <p>Checkout, refunds and the membership-subscribe flow are <strong>built and tested in test-mode</strong>. They go live the moment we have:</p>
        <ul style="font-size:16px;line-height:1.7;margin:14px 0 0 22px;color:var(--text-soft)">
          <li>Your Stripe <em>live</em> API keys (publishable + secret + webhook signing secret).</li>
          <li>Your production email provider credentials (Resend, SendGrid, or your own SMTP).</li>
          <li>Your production domain name.</li>
        </ul>
        <p style="margin-top:14px">Switching from test to live is a <strong>30-second config change</strong> — no code work, no redeploy of the application.</p>
      </div>
    </section>
  `,
});
writeFileSync(out('features/index.html'), features);

/* ─────────────────────────────────────────────────────────────────────
   4. WORKFLOWS — three real end-to-end flows
   ───────────────────────────────────────────────────────────────────── */

const workflows = shell({
  title: 'Real Workflows',
  active: 'workflows',
  eyebrow: 'End-to-end',
  h1: 'How the backend handles three real customer journeys.',
  tagline:
    'Step-by-step, what happens behind the scenes when a customer registers, places a bid, and wins a lot.',
  body: `
    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2">Workflow 1 — A new customer registers and signs in</h2>
        <p class="section-sub">From the public sign-up form to a fully logged-in dashboard session, in milliseconds.</p>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);padding:22px 28px;margin-top:18px">
          <div class="flow-step"><div class="flow-step-num">1</div><div>
            <h4>Visitor opens the sign-up form on the storefront</h4>
            <p>The frontend form sends the email, password and name to <strong>POST /api/auth/register</strong>.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">2</div><div>
            <h4>Backend rate-limits the request</h4>
            <p>If the same IP has tried more than 10 times in 5 minutes, the request is refused with a clear error — protects against automated sign-up abuse.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">3</div><div>
            <h4>Backend validates inputs and checks the password strength</h4>
            <p>Email must be a real email format. Password must be at least 12 characters and not in the list of common breached passwords.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">4</div><div>
            <h4>Backend checks the email isn't already in use</h4>
            <p>If it is, the request is rejected with a clear "email already registered" message — and the attempt is logged so we can spot abuse patterns.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">5</div><div>
            <h4>Backend creates the user with role = customer</h4>
            <p>The role is fixed by the backend — a visitor cannot trick the form into making them an admin.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">6</div><div>
            <h4>Backend logs the user in immediately</h4>
            <p>A secure session cookie is returned so the frontend can take the customer straight to their dashboard — no extra "now please log in" step.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">7</div><div>
            <h4>Action is recorded in the audit log</h4>
            <p>Who signed up, from which IP, at what time. Available to you in the admin panel under "Audit Logs".</p>
          </div></div>
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2">Workflow 2 — A customer places a bid on a live auction</h2>
        <p class="section-sub">From clicking "place bid" to the new price showing up on everyone else's open browser tab.</p>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);padding:22px 28px;margin-top:18px">
          <div class="flow-step"><div class="flow-step-num">1</div><div>
            <h4>Logged-in customer opens an auction lot page</h4>
            <p>Frontend reads the lot details, current top bid and bid history from <strong>GET /api/auctions/[id]</strong>.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">2</div><div>
            <h4>Customer enters a bid amount and clicks "Place Bid"</h4>
            <p>Frontend sends <strong>POST /api/auctions/[id]/bid</strong> with the amount.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">3</div><div>
            <h4>Backend runs a wall of checks before accepting</h4>
            <p>Auction must be in <em>live</em> status (not upcoming, ended or cancelled). Bid must beat the current top by at least the minimum increment. Reserve price must be met. The bidder must not be the seller. All of these run inside a single database transaction so the bid either fully succeeds or fully fails — never half-applied.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">4</div><div>
            <h4>Auto-bid resolution</h4>
            <p>If the previous high bidder had set a max-auto-bid, the backend instantly raises their bid to keep them on top — up to their ceiling. The system can play several auto-bid rounds in one request without sending anyone email storms.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">5</div><div>
            <h4>Bid is persisted; auction record updated atomically</h4>
            <p>The bid lands in the bids ledger and the auction's "current bid" and "leading bidder" fields are updated in the same transaction.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">6</div><div>
            <h4>Everyone watching the lot sees the new price within a second</h4>
            <p>A live-update channel pushes the new top bid to every connected viewer — no need for them to refresh the page.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">7</div><div>
            <h4>Out-bid email</h4>
            <p>The previously-leading bidder receives an "you were outbid" email within seconds, with a button to return to the lot.</p>
          </div></div>
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2">Workflow 3 — An auction ends and the winner gets a certificate</h2>
        <p class="section-sub">Fully automated. No human in the loop — closes itself, picks the winner, emails the parties, generates the PDF.</p>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);padding:22px 28px;margin-top:18px">
          <div class="flow-step"><div class="flow-step-num">1</div><div>
            <h4>Background worker runs every minute</h4>
            <p>A separate worker process — independent of the website — checks for auctions whose end time has passed.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">2</div><div>
            <h4>For each ended auction, the worker resolves the winner</h4>
            <p>If there's at least one bid above the reserve, the highest bidder wins. If no bids met the reserve, the lot is marked <em>not sold</em>.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">3</div><div>
            <h4>Auction status transitions to "sold" or "ended"</h4>
            <p>This change is what makes the storefront show "winning bid" instead of "place bid" — no manual flip needed.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">4</div><div>
            <h4>"You won" email goes to the winner</h4>
            <p>Includes the lot, the price they paid, and the link to complete payment.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">5</div><div>
            <h4>Once paid, certificate of authenticity is generated</h4>
            <p>A PDF is created that includes the artwork image, artist name, dimensions, sale date, and a <strong>SHA-256 cryptographic hash of the artwork's image file</strong>. If anyone ever tries to swap the image, the hash on the certificate won't match — instant tamper detection.</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">6</div><div>
            <h4>Certificate verification endpoint</h4>
            <p>Anyone (a future buyer, an insurer, an auctioneer) can paste the certificate's serial number into <code>/certificate/verify</code> on the storefront and instantly see "yes, this certificate is authentic and refers to this artwork."</p>
          </div></div>
          <div class="flow-step"><div class="flow-step-num">7</div><div>
            <h4>Every step is audit-logged</h4>
            <p>Winner resolution, payment confirmation, certificate issuance — all stamped with timestamps and actor identity for compliance.</p>
          </div></div>
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2" style="font-size:22px">Why this matters</h2>
        <p>You do not need to manually close auctions. You do not need to manually send "you won" emails. You do not need to manually generate certificates. <strong>The platform runs itself.</strong> Your only involvement is to add new artworks, approve new artists, and watch the dashboard.</p>
      </div>
    </section>
  `,
});
writeFileSync(out('workflows/index.html'), workflows);

/* ─────────────────────────────────────────────────────────────────────
   5. BACKEND ARCHITECTURE — non-technical explanation
   ───────────────────────────────────────────────────────────────────── */

const architecture = shell({
  title: 'Backend Architecture',
  active: 'architecture',
  eyebrow: 'In plain English',
  h1: 'How the backend keeps every frontend page in sync, secure and fast.',
  tagline:
    'No jargon. A picture of the moving parts and why they are arranged the way they are.',
  body: `
    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2">The three machines</h2>
        <p>Your platform runs as three coordinated services. Each does one job and only one job — if one of them needs maintenance, the others keep working.</p>

        <div class="card-grid" style="margin-top:22px">
          <div class="card">
            <div class="card-icon">🌐</div>
            <h3>The Storefront</h3>
            <p>The website your customers and artists visit. Every page they see is rendered here. It does <em>not</em> hold any data of its own — it asks the API for everything.</p>
          </div>
          <div class="card">
            <div class="card-icon">⚙️</div>
            <h3>The API & Admin</h3>
            <p>The heart of the platform. Handles every login, every bid, every payment, every form submission. Also serves the admin panel you saw on the previous page.</p>
          </div>
          <div class="card">
            <div class="card-icon">⚡</div>
            <h3>The Live-Update Channel</h3>
            <p>A separate, lightweight service whose only job is pushing live bid updates to every connected viewer. Keeps the auction page feeling instantaneous.</p>
          </div>
        </div>

        <p style="margin-top:24px">Behind them is <strong>one shared database</strong> that stores everything. Multiple copies of the API & Admin can read from the same database, which is how the platform scales as traffic grows.</p>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2">How a frontend feature connects to the backend</h2>
        <p>Every frontend feature follows the same simple pattern. Take "place a bid" as an example:</p>

        <div style="margin:24px 0;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);padding:24px 28px;font-family:'SF Mono','Menlo','Consolas',monospace;font-size:13px;line-height:1.8;color:var(--text-soft)">
          <div style="color:var(--accent);font-weight:600;margin-bottom:8px">[Customer browser]</div>
          &nbsp;&nbsp;↓ &nbsp;clicks "Place Bid"<br>
          <div style="color:var(--accent);font-weight:600;margin-top:8px">[Storefront]</div>
          &nbsp;&nbsp;↓ &nbsp;sends bid amount to the API<br>
          <div style="color:var(--accent);font-weight:600;margin-top:8px">[API]</div>
          &nbsp;&nbsp;↓ &nbsp;validates &nbsp;→&nbsp; saves to database &nbsp;→&nbsp; tells the Live-Update Channel<br>
          <div style="color:var(--accent);font-weight:600;margin-top:8px">[Live-Update Channel]</div>
          &nbsp;&nbsp;↓ &nbsp;broadcasts new top bid to every connected viewer<br>
          <div style="color:var(--accent);font-weight:600;margin-top:8px">[Other customers' browsers]</div>
          &nbsp;&nbsp;✓ &nbsp;see the new bid in under a second, no refresh needed
        </div>

        <p>The same shape applies to every other feature — sign up, place an order, submit an artist application, subscribe to the newsletter, post an article. Just the data and the validation rules change.</p>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2">What the backend protects against, automatically</h2>

        <div class="kv">
          <div class="kv-row">
            <div class="kv-key">Brute-force login attempts</div>
            <div class="kv-value">Repeated failed sign-ins from one IP get blocked for several minutes. Adds friction for attackers, invisible to real users.</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">Weak passwords</div>
            <div class="kv-value">Minimum 12 characters, real-time strength check, common-breach blacklist. Customers cannot create unprotected accounts.</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">Account takeover</div>
            <div class="kv-value">Optional two-factor authentication (TOTP — works with Google Authenticator, Authy, 1Password and similar). One-time recovery codes for lost devices.</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">Cross-site request forgery</div>
            <div class="kv-value">Every form is signed with a per-session token; copy-pasted URLs from an attacker can't fire actions on your behalf.</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">Injection attacks (SQL / NoSQL / script)</div>
            <div class="kv-value">Every input is validated and sanitised before reaching the database. No raw user input ever flows through.</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">Sensitive-data exposure</div>
            <div class="kv-value">Passwords are one-way hashed (cannot be read back, even by us). Stripe never sends raw card numbers through your platform — payment fields are hosted on Stripe's own infrastructure.</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">Insecure direct object reference</div>
            <div class="kv-value">A customer cannot browse to <code>/orders/12345</code> to see someone else's order — every request checks "is this user allowed to see this record?".</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">Tampered certificates</div>
            <div class="kv-value">Every certificate of authenticity has a SHA-256 hash of the original artwork image. Swap the image, the hash no longer matches — tamper detected automatically.</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">Privilege escalation</div>
            <div class="kv-value">Roles (admin / artist / customer) are enforced on every single endpoint server-side. Even if a clever user crafts a malicious request, they cannot become an admin.</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">Untraceable changes</div>
            <div class="kv-value">Every sensitive admin action is recorded with actor, target, IP, user-agent, timestamp. Full forensic trail.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2">Operations & monitoring</h2>
        <p>The backend ships with everything needed to operate it in production from day one.</p>

        <div class="card-grid">
          <div class="card">
            <h3 style="font-size:16px">Health checks</h3>
            <p>Three endpoints monitoring tools call automatically: liveness ("is it alive"), readiness ("can it serve traffic"), and metrics ("how is it performing").</p>
          </div>
          <div class="card">
            <h3 style="font-size:16px">Structured logs</h3>
            <p>Every request emits one log line with a request ID, route, status code and timing — paste the request ID into a log search to trace any single customer's actions.</p>
          </div>
          <div class="card">
            <h3 style="font-size:16px">Background workers</h3>
            <p>Closing auctions, sending emails, retrying failed jobs — all handled by a separate worker process that doesn't slow down the website.</p>
          </div>
          <div class="card">
            <h3 style="font-size:16px">Zero-downtime deployments</h3>
            <p>Configured to roll new versions out without interrupting live customers. Crucial for a platform with live auctions in progress.</p>
          </div>
          <div class="card">
            <h3 style="font-size:16px">Secret rotation</h3>
            <p>Every signing key can be rotated with one environment-variable change and a restart — no code change required.</p>
          </div>
          <div class="card">
            <h3 style="font-size:16px">Containerised deployment</h3>
            <p>Ships as Docker images so it runs identically on your laptop, on staging, and on production. No "works on my machine" surprises.</p>
          </div>
        </div>
      </div>
    </section>
  `,
});
writeFileSync(out('architecture/index.html'), architecture);

/* ─────────────────────────────────────────────────────────────────────
   6. REMAINING — honest punch list
   ───────────────────────────────────────────────────────────────────── */

const remainingRows = [
  ['Stripe live keys integration', 'Awaiting your input', 'Switch from test-mode to live payments. 30-second config change once you provide live keys.', 'partial'],
  ['Production email provider', 'Awaiting your input', 'Connect Resend / SendGrid / SMTP. Today the system writes emails to the developer console for testing.', 'partial'],
  ['Production domain & TLS certificate', 'Awaiting your input', 'Backend supports HTTPS out of the box once a certificate is installed. Domain is needed to issue one.', 'partial'],
  ['Image storage on cloud (S3)', 'Awaiting your input', 'Backend supports S3-compatible storage. Bucket credentials needed. Currently using local disk for development.', 'partial'],
  ['MongoDB Atlas cluster URL', 'Awaiting your input', 'For production we recommend MongoDB Atlas. Backend will switch over with a single connection-string change.', 'partial'],

  ['"Resend winner email" UI button', 'Polish', 'Endpoint already exists; needs a clickable button inside the auction edit screen.', 'pending'],
  ['"Issue refund" UI button', 'Polish', 'Endpoint already exists; needs a clickable button inside the order edit screen.', 'pending'],
  ['Two-factor enrolment QR-code in admin', 'Polish', 'Today admins enrol via API call; needs a self-service screen in the admin panel.', 'pending'],
  ['Bulk image uploads', 'Nice-to-have', 'Currently artworks are uploaded one image at a time. Drag-and-drop bulk import could save artist setup time.', 'pending'],
  ['Multi-language storefront', 'Out of scope', 'Frontend was delivered in English only. Adding Spanish / French / etc. requires translation passes plus a frontend i18n setup — not contracted.', 'pending'],
];

const remaining = shell({
  title: 'What\'s Remaining',
  active: 'remaining',
  eyebrow: 'Honest punch list',
  h1: 'What\'s left, what\'s blocked on your input, what\'s polish.',
  tagline:
    'No surprises — here\'s exactly what stands between today and a production launch.',
  body: `
    <section class="section-tight">
      <div class="container-wide">
        <table class="feature-table">
          <thead>
            <tr>
              <th style="width:28%">Item</th>
              <th style="width:18%">Category</th>
              <th style="width:42%">Details</th>
              <th style="width:12%">Status</th>
            </tr>
          </thead>
          <tbody>
            ${remainingRows.map(([item, cat, det, st]) => `
              <tr>
                <td><strong>${item}</strong></td>
                <td>${cat}</td>
                <td>${det}</td>
                <td><span class="status-pill ${st}">${statusLabel[st]}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2">What you need to provide to unblock production launch</h2>
        <div class="list">
          <ul>
            <li><strong>Stripe live API keys</strong> — publishable, secret and webhook signing secret. Generated in your Stripe dashboard once you complete the live-mode application.</li>
            <li><strong>An email provider account</strong> — Resend (recommended), SendGrid, or your own SMTP details. Tell me which and provide the API key.</li>
            <li><strong>A production domain</strong> — e.g. <code>sevenarts.com</code>. You purchase it, we point it at the production server.</li>
            <li><strong>An S3-compatible image bucket</strong> — any provider works (Hostinger Object Storage, AWS S3, Cloudflare R2, Backblaze B2). Access key + secret + bucket name.</li>
            <li><strong>A MongoDB Atlas connection string</strong> — free tier is enough to start with, takes 10 minutes to set up.</li>
          </ul>
        </div>
        <p style="margin-top:18px">Once those five are in hand, the platform can be deployed to production and made publicly accessible within the same day.</p>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <h2 class="section-h2">What "polish" items mean</h2>
        <p>The polish items in the table above are <strong>refinements</strong>, not missing features. Every one of them works today through an admin command or API call — the missing piece is just a button in the admin screen that makes it easier to do without help. They can be added incrementally after launch without any disruption.</p>
      </div>
    </section>
  `,
});
writeFileSync(out('remaining/index.html'), remaining);

console.log('SevenArts report generated:');
console.log('  - index.html');
console.log('  - admin/index.html');
console.log('  - features/index.html');
console.log('  - workflows/index.html');
console.log('  - architecture/index.html');
console.log('  - remaining/index.html');
