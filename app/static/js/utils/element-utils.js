export function showElement(elementId) {
  const element = document.getElementById(elementId);

  if (element) {
    element.classList.remove("hidden", "pointer-events-none");
    element.classList.add("pointer-events-auto");

    requestAnimationFrame(() => {
      element.classList.remove("opacity-0", "-translate-y-2");
      element.classList.add("opacity-100", "translate-y-0");
    });
  }
}

export function hideElement(elementId) {
  const element = document.getElementById(elementId);

  if (element) {
    element.classList.remove(
      "opacity-100",
      "translate-y-0",
      "pointer-events-auto",
    );
    element.classList.add("opacity-0", "-translate-y-2", "pointer-events-none");

    setTimeout(() => {
      element.classList.add("hidden");
    }, 100); // Matches Tailwind duration-300
  }
}
