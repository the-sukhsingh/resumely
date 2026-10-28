// Resumely Floating Widget
// Disabled per user preference: no floating UI is injected onto web pages.
// All matching details, tracking, and application autofill are accessed directly via the extension popup.

(function () {
  // Clean up any legacy or existing floating hosts
  const host = document.getElementById("resumely-floating-host");
  if (host) {
    host.remove();
  }
  const toast = document.getElementById("resumely-autofill-toast");
  if (toast) {
    toast.remove();
  }
})();
