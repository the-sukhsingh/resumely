// Resumely In-Page Authentication & Data Bridge
// Runs on Resumely web app (localhost:3000 and *.resumely.tech) to seamlessly sync session

(function () {
  if (window.__resumely_auth_bridge_loaded) return;
  window.__resumely_auth_bridge_loaded = true;

  async function checkAndSyncSession() {
    try {
      // 1. Fetch current user session from Resumely web app
      const sessionRes = await fetch("/api/auth/session");
      if (!sessionRes.ok) return;

      const session = await sessionRes.json();
      if (!session || !session.user || !session.user.email) {
        return;
      }

      // 2. Fetch full user data, master resume and tailored versions
      const extensionSyncRes = await fetch(`/api/extension/session?email=${encodeURIComponent(session.user.email)}`);
      if (!extensionSyncRes.ok) return;

      const fullData = await extensionSyncRes.json();
      if (fullData && fullData.authenticated && fullData.user) {
        // Send message to extension background worker to persist in chrome.storage.local
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({
            action: "SYNC_AUTHENTICATED_USER",
            payload: fullData,
          }, (response) => {
            if (response && response.success && !window.__resumely_toast_shown) {
              window.__resumely_toast_shown = true;
              showSyncPill(fullData.user.name || "User");
            }
          });
        }
      }
    } catch (err) {
      // Silently ignore if not logged in or during initial loading
    }
  }

  function showSyncPill(userName) {
    const pill = document.createElement("div");
    pill.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 999999;
      background: #09090b;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 9999px;
      padding: 6px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #f4f4f5;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
      animation: resumelySlideDown 0.3s ease;
    `;
    pill.innerHTML = `
      <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#10b981; box-shadow:0 0 6px #10b981;"></span>
      <span>Resumely Extension Connected (${userName})</span>
    `;

    document.body.appendChild(pill);
    setTimeout(() => {
      pill.style.opacity = "0";
      pill.style.transform = "translateY(-10px)";
      setTimeout(() => pill.remove(), 400);
    }, 3500);
  }

  // Run initial sync after DOM settles
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(checkAndSyncSession, 800);
  } else {
    window.addEventListener("DOMContentLoaded", () => setTimeout(checkAndSyncSession, 800));
  }

  // Listen for login/logout events on the web app
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "RESUMELY_AUTH_CHANGED") {
      checkAndSyncSession();
    }
  });
})();
