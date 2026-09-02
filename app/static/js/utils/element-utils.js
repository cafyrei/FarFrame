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

export function filterTextLabel(label) {
  const videoGrid = document.getElementById("video-grid");
  if (!videoGrid) return;

  const existingLabel = document.getElementById("filter-label");
  if (existingLabel) {
    existingLabel.remove();
  }

  const template = document.createElement("div");

  template.innerHTML = `
    <div id="filter-label" class="absolute inset-0 flex items-center justify-center uppercase text-5xl font-bold text-white p-2 pointer-events-none transition-opacity duration-500 ease-out opacity-100 drop-shadow-lg">
      ${label}
    </div>
  `.trim();


  const labelElement = template.firstElementChild;
  
  videoGrid.appendChild(labelElement);
  setTimeout(() => {
    labelElement.classList.remove("opacity-100");
    labelElement.classList.add("opacity-0");

    setTimeout(() => {
      labelElement.remove();
    }, 500);
  }, 600);
}
