import { showElement, hideElement } from "../utils/element-utils.js";

let toastTimer;

document.getElementById("close-toast-button")?.addEventListener("click", () => {
  clearTimeout(toastTimer);
  hideElement("toast");
});

const THEMES = {
  error: {
    bg: "bg-red-100",
    border: "border-red-300",
    text: "text-red-900",
    icon: "../static/images/icons/alert.svg",
  },
  copied: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-emerald-900",
    icon: "../static/images/icons/clipboard.svg",
  },
};

export function triggerToast(message, type = "error") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastIcon = document.getElementById("toast-icon");

  if (!toast) return;

  const theme = THEMES[type] || THEMES.error;
  toastMessage.textContent = message;
  toastIcon.src = theme.icon;

  toast.className = `fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 border px-4 py-3 rounded-xl shadow-lg transition-all duration-300 opacity-0 -translate-y-2 pointer-events-none max-w- mx-auto ${theme.bg} ${theme.border}`;
  toastMessage.className = `text-sm font-medium flex-1 text-left ${theme.text}`;

  clearTimeout(toastTimer);

  showElement("toast");

  toastTimer = setTimeout(() => {
    hideElement("toast");
  }, 3500);
}
