// Login page — error display + password reveal toggle.
// All actual auth happens server-side in /auth.php.

(function () {
  const params = new URLSearchParams(location.search)

  // Show error if redirected back from /auth.php with ?error=1
  if (params.get("error")) {
    const msg = document.getElementById("error-msg")
    if (msg) msg.hidden = false
  }

  // Carry forward the original requested URL (set by .htaccess via ?next=)
  const next = params.get("next")
  const nextField = document.getElementById("next-field")
  if (next && nextField && /^\/[^?#]*$/.test(next) && next !== "/login/") {
    nextField.value = next
  }

  // Password reveal toggle
  const reveal = document.getElementById("reveal")
  const pw = document.getElementById("password")
  if (reveal && pw) {
    reveal.addEventListener("click", () => {
      const show = pw.type === "password"
      pw.type = show ? "text" : "password"
      reveal.setAttribute("aria-pressed", String(show))
      reveal.setAttribute("aria-label", show ? "Hide password" : "Show password")
    })
  }

  // Disable submit button briefly to prevent double-submit
  const form = document.querySelector("form")
  if (form) {
    form.addEventListener("submit", () => {
      const btn = form.querySelector(".submit-btn")
      if (btn) {
        btn.disabled = true
        const span = btn.querySelector("span")
        if (span) span.textContent = "Signing in…"
      }
    })
  }
})()
